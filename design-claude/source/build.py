"""Assemble the two propagation GIFs from rendered frames and check them.

Usage: python3 build.py <frames-dir> <out-dir>
Reads  <frames-dir>/{without,with}/01.png … 64.png (2400 × 1350) and geometry.json (from render.cjs).
Writes <out-dir>/propagation-without.gif, propagation-with.gif, assets/hero-frame-32.png,
       review/{without,with}-frame-{20,32,60}.png and verification.json.
"""
import json
import math
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageSequence

W, H, FRAMES = 1200, 675, 64
BG = (246, 249, 251)
DELAYS = [50] * FRAMES
DELAYS[59] = 1550  # frame 60: 50 ms plus a 1.5 s hold on the end state
BRAND = ["#F6F9FB", "#FFFFFF", "#102A43", "#438CCB", "#CCEAF4", "#83B9CD",
         "#F3B044", "#EE742C", "#B82C25", "#71352E"]
VARIANTS = ("without", "with")


def load(frames_dir, variant):
    return [Image.open(os.path.join(frames_dir, variant, f"{i:02d}.png")).convert("RGB").resize((W, H), Image.LANCZOS)
            for i in range(1, FRAMES + 1)]


def shared_palette(frames):
    """One 256-color palette for both GIFs, built from sampled frames plus the brand colors."""
    samples = [f for v in VARIANTS for f in frames[v][::3]]
    swatch_h = 40
    mont = Image.new("RGB", (W, H * len(samples) + swatch_h * len(BRAND)))
    for i, f in enumerate(samples):
        mont.paste(f, (0, i * H))
    for i, hexc in enumerate(BRAND):
        mont.paste(Image.new("RGB", (W, swatch_h), hexc), (0, H * len(samples) + i * swatch_h))
    pal = mont.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    entries = pal.getpalette()[:768]
    # make sure the page background is in the table exactly
    best = min(range(256), key=lambda k: sum((entries[3 * k + c] - BG[c]) ** 2 for c in range(3)))
    entries[3 * best:3 * best + 3] = list(BG)
    pal.putpalette(entries)
    return pal


def gif_info(path):
    """Read the GIF structure directly: color tables, frame count, delays and loop count."""
    b = open(path, "rb").read()
    flags = b[10]
    i = 13 + (3 * 2 ** ((flags & 7) + 1) if flags & 0x80 else 0)
    local = frames = 0
    delays, loop = [], None
    while i < len(b):
        if b[i] == 0x21:
            label = b[i + 1]
            i += 2
            if label == 0xF9:
                delays.append((b[i + 2] | b[i + 3] << 8) * 10)
            if label == 0xFF and b[i + 1:i + 12] == b"NETSCAPE2.0":
                loop = b[i + 14] | b[i + 15] << 8
            while b[i]:
                i += b[i] + 1
            i += 1
        elif b[i] == 0x2C:
            frames += 1
            fl = b[i + 9]
            i += 10
            if fl & 0x80:
                local += 1
                i += 3 * 2 ** ((fl & 7) + 1)
            i += 1
            while b[i]:
                i += b[i] + 1
            i += 1
        else:
            break
    return {"width": b[6] | b[7] << 8, "height": b[8] | b[9] << 8, "frames": frames, "delays_ms": delays,
            "global_palette": bool(flags & 0x80), "local_palettes": local, "loop": loop,
            "bytes": os.path.getsize(path)}


def oklab_lc(rgb):
    """OKLab lightness and chroma of an sRGB color."""
    r, g, b = [((c / 255 + 0.055) / 1.055) ** 2.4 if c / 255 > 0.04045 else c / 255 / 12.92 for c in rgb]
    l = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    m = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    s = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, math.hypot(a, bb)


def main(frames_dir, out_dir):
    frames = {v: load(frames_dir, v) for v in VARIANTS}
    geo = json.load(open(os.path.join(frames_dir, "geometry.json")))
    pal = shared_palette(frames)
    os.makedirs(os.path.join(out_dir, "assets"), exist_ok=True)
    os.makedirs(os.path.join(out_dir, "review"), exist_ok=True)

    # Pillow merges identical consecutive frames (the still opening would collapse into one).
    # Toggle the bottom-right pixel between the background and its nearest palette neighbor,
    # an invisible change that keeps all 64 frames.
    entries = pal.getpalette()[:768]
    rgb = [tuple(entries[3 * k:3 * k + 3]) for k in range(256)]
    bg_idx = rgb.index(BG)
    alt_idx = min((k for k in range(256) if rgb[k] != BG), key=lambda k: sum((rgb[k][c] - BG[c]) ** 2 for c in range(3)))

    report = {"gifs": {}, "checks": {}, "frame_marker": {"pixel": [W - 1, H - 1], "colors": [list(BG), list(rgb[alt_idx])]}}
    decoded = {}
    for v in VARIANTS:
        q = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames[v]]
        for n, im in enumerate(q):
            im.putpixel((W - 1, H - 1), bg_idx if n % 2 == 0 else alt_idx)
        path = os.path.join(out_dir, f"propagation-{v}.gif")
        # passing the palette makes Pillow write one global table instead of a local table per delta frame
        q[0].save(path, save_all=True, append_images=q[1:], duration=DELAYS, loop=0, optimize=False, disposal=1,
                  palette=bytes(entries))
        report["gifs"][f"propagation-{v}.gif"] = gif_info(path)
        decoded[v] = [fr.convert("RGB") for fr in ImageSequence.Iterator(Image.open(path))]
        for n in (20, 32, 60):
            decoded[v][n - 1].save(os.path.join(out_dir, "review", f"{v}-frame-{n}.png"))
    decoded["with"][31].save(os.path.join(out_dir, "assets", "hero-frame-32.png"))

    checks = report["checks"]
    for name, info in report["gifs"].items():
        checks[f"{name}: 1200 x 675"] = (info["width"], info["height"]) == (W, H)
        checks[f"{name}: exactly 64 frames"] = info["frames"] == FRAMES
        checks[f"{name}: 50 ms per frame, 1,550 ms on frame 60"] = info["delays_ms"] == DELAYS
        checks[f"{name}: one global color table, no local tables"] = info["global_palette"] and info["local_palettes"] == 0
        checks[f"{name}: loops forever"] = info["loop"] == 0
    a = open(os.path.join(out_dir, "propagation-without.gif"), "rb").read()
    b = open(os.path.join(out_dir, "propagation-with.gif"), "rb").read()
    checks["both GIFs share the same color table"] = a[13:13 + 768] == b[13:13 + 768]

    # frames 1–20 may differ only where the boards are, plus 4 px around them for the outline's
    # antialiasing and the reach of the LANCZOS downscale
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    for poly in geo["boards"]:
        draw.polygon([tuple(p) for p in poly], fill=255)
    outside = ImageChops.invert(mask.filter(ImageFilter.MaxFilter(9)))
    stray = 0
    for i in range(20):
        diff = ImageChops.difference(decoded["with"][i], decoded["without"][i]).convert("L").point(lambda p: 255 if p > 6 else 0)
        stray += ImageChops.multiply(diff, outside).histogram()[255]
    checks["frames 1-20 differ only at the boards"] = stray == 0
    report["frames_1_20_pixels_differing_outside_boards"] = stray

    # with Aerotherm the neighbors stay cool: sample the middle of each neighbor's front face
    cool = True
    samples = {}
    for i in (0, 1, 3, 4):
        x, y = geo["cellCenters"][i]
        cols = [decoded["with"][n].getpixel((int(x), int(y))) for n in range(4, 60)]
        samples[f"cell {i + 1}"] = {"frame 5": list(cols[0]), "frame 60": list(cols[-1])}
        cool &= all(c[2] > c[0] + 40 for c in cols)
    checks["with Aerotherm, the four neighbors never warm"] = cool
    report["neighbor_samples"] = samples

    # no muddy gray: mid-lightness pixels across the cells keep their chroma.
    # (The ramp deliberately passes a light, near-white glow point at L ≈ 0.93; that is not gray.
    #  A plain RGB mix of the brand blue and amber, (155, 158, 136), sits at L ≈ 0.69, C ≈ 0.03.)
    gray = 0
    for n in range(4, 60):
        f = decoded["without"][n]
        for (x, y) in geo["cellCenters"]:
            for dx in range(-30, 31, 3):
                L, C = oklab_lc(f.getpixel((int(x) + dx, int(y))))
                if 0.35 < L < 0.75 and C < 0.04:
                    gray += 1
    checks["no gray mid-tones on the cells (without)"] = gray == 0
    report["gray_samples"] = gray

    json.dump(report, open(os.path.join(out_dir, "verification.json"), "w"), indent=2)
    for k, ok in checks.items():
        print(("PASS " if ok else "FAIL ") + k)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
