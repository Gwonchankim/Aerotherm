"""Draw the two Applications illustrations (EV pack, ESS rack) as isometric cutaway SVGs.

Usage: python3 applications.py <out-dir>
Writes <out-dir>/application-ev.svg, application-ess.svg and callouts.json
(the position of the "AeroTherm board" label on each image, in percent).

One battery module, drawn in detail: the front wall is cut down to a hatched lip so the row of
prismatic cells shows, with an AeroTherm board between every pair. One board is lifted out above
the module (an exploded view) so its full area, the size of a cell's broad face, can be seen.
The context around the module is ghosted: a pack tray with neighbouring modules for EV, a rack
with modules below for ESS.
"""
import json
import math
import os
import sys

W_VB, H_VB = 1600, 900
C, S = math.cos(math.radians(30)), 0.5

# module geometry (illustration units)
N, T, W, H, PAD = 8, 30, 150, 100, 6           # cells, cell thickness (x), width (z), height (y), board thickness
LIFT_GAP = 3                                     # the board between cells 4 and 5 is lifted out
LIFT_Y = H + 92                                  # how far above the module the lifted board floats
L = N * T + (N - 1) * PAD                        # stack length along x

INK = '#1F3B57'
GHOST = '#C4D0D9'


def proj(x, y, z):
    return ((x - z) * C, (x + z) * S - y)


class Canvas:
    def __init__(self):
        self.items = []

    def poly(self, pts3, fill, stroke=INK, sw=1.6, extra=''):
        pts = ' '.join(f'{x:.2f},{y:.2f}' for x, y in (proj(*p) for p in pts3))
        self.items.append(f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" {extra}/>')

    def line(self, a, b, stroke=INK, sw=1.2, extra=''):
        (x1, y1), (x2, y2) = proj(*a), proj(*b)
        self.items.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" {extra}/>')

    def raw(self, s):
        self.items.append(s)

    def box(self, x0, x1, y0, y1, z0, z1, top, front, side, stroke=INK, sw=1.6, faces=('x', 'top', 'z'), extra=''):
        """Draw the three visible faces of an axis-aligned box: +x side, top, +z front."""
        for f in faces:
            if f == 'x':
                self.poly([(x1, y0, z0), (x1, y0, z1), (x1, y1, z1), (x1, y1, z0)], side, stroke, sw, extra)
            elif f == 'top':
                self.poly([(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)], top, stroke, sw, extra)
            elif f == 'z':
                self.poly([(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)], front, stroke, sw, extra)


def ghost_box(cv, x0, x1, y0, y1, z0, z1):
    cv.box(x0, x1, y0, y1, z0, z1, '#F8FAFB', '#F2F5F8', '#ECF0F4', GHOST, 1.2)


def ghost_module(cv, dx=0, dy=0, dz=0):
    """A neighbouring module, drawn in light lines: housing plus the cell joints on its front."""
    ghost_box(cv, dx - 14, dx + L + 14, dy - 8, dy, dz - 8, dz + W + 8)
    ghost_box(cv, dx - 14, dx + L + 14, dy, dy + H, dz - 8, dz + W + 8)
    for i in range(1, N):
        x = dx + i * (T + PAD) - PAD / 2
        cv.line((x, dy + 4, dz + W + 8), (x, dy + H - 4, dz + W + 8), GHOST, 1.1)


def module(cv, dx=0, dy=0, dz=0):
    """The detailed module with the cutaway front and the lifted board. Returns the label anchor."""
    X = lambda x: dx + x
    Y = lambda y: dy + y
    Z = lambda z: dz + z
    # soft ground shadow
    sx, sy = proj(X(L / 2), Y(-8), Z(W / 2 + 30))
    cv.raw(f'<ellipse cx="{sx:.1f}" cy="{sy + 18:.1f}" rx="{(L + W) * C * 0.62:.1f}" ry="{(L + W) * S * 0.34:.1f}" fill="#102A43" opacity="0.07" filter="url(#soft)"/>')
    # base tray
    cv.box(X(-14), X(L + 14), Y(-10), Y(0), Z(-8), Z(W + 8), '#E9EEF2', '#D6DFE6', '#CBD6DE')
    # back wall and left end plate (behind the cells)
    cv.box(X(-14), X(L + 14), Y(0), Y(H - 6), Z(-8), Z(-3), '#E6ECF0', '#DCE4EA', '#CFD9E1')
    cv.box(X(-14), X(-4), Y(0), Y(H + 6), Z(-8), Z(W + 8), '#E9EEF2', '#D9E2E8', '#CBD6DE')
    # cells and boards, back to front along x
    x = 0
    lifted = None
    for i in range(N):
        cv.box(X(x), X(x + T), Y(0), Y(H), Z(0), Z(W), '#B9D5EE', '#6CA4D7', '#4D89C3', INK, 1.6)
        # a quiet seam on the narrow end
        cv.line((X(x + 4), Y(H - 10), Z(W)), (X(x + T - 4), Y(H - 10), Z(W)), '#2B5A85', 0.9, 'opacity="0.55"')
        x += T
        if i < N - 1:
            if i == LIFT_GAP:
                lifted = x                                  # leave the slot empty: this board is lifted out
            else:
                cv.box(X(x), X(x + PAD), Y(0), Y(H), Z(0), Z(W), '#E7F4F9', '#DDF0F7', '#CDE7F1', '#5E9FBA', 1.3)
            x += PAD
    # terminals and vents on top of the cells, back to front
    tops = []
    for i in range(N):
        xc = i * (T + PAD) + T / 2
        for zc in (W * 0.24, W * 0.76):
            tops.append(('terminal', xc, zc))
        tops.append(('vent', xc, W * 0.5))
    tops.sort(key=lambda t: t[1] + t[2])
    for kind, xc, zc in tops:
        if kind == 'terminal':
            cv.box(X(xc - 5), X(xc + 5), Y(H), Y(H + 5), Z(zc - 6), Z(zc + 6), '#CDD6DD', '#A9B5BF', '#9AA7B2', INK, 1.0)
        else:
            cv.poly([(X(xc - 4), Y(H + 0.5), Z(zc - 9)), (X(xc + 4), Y(H + 0.5), Z(zc - 9)), (X(xc + 4), Y(H + 0.5), Z(zc + 9)), (X(xc - 4), Y(H + 0.5), Z(zc + 9))],
                    '#8FB6DA', '#2B5A85', 0.9)
    # busbars: series connections, alternating ends of the module
    for i in range(N - 1):
        zc = W * 0.24 if i % 2 == 0 else W * 0.76
        x0 = i * (T + PAD) + T / 2 - 5
        x1 = (i + 1) * (T + PAD) + T / 2 + 5
        cv.box(X(x0), X(x1), Y(H + 5), Y(H + 7), Z(zc - 4), Z(zc + 4), '#B8C3CC', '#9AA7B2', '#8E9BA6', INK, 0.9)
    # right end plate (in front of the cells)
    cv.box(X(L + 4), X(L + 14), Y(0), Y(H + 6), Z(-8), Z(W + 8), '#E9EEF2', '#D9E2E8', '#C6D2DB')
    # the front wall, cut down to a lip: the cut face is hatched
    lip = 22
    cv.box(X(-14), X(L + 14), Y(0), Y(lip), Z(W + 3), Z(W + 8), 'url(#hatch)', '#D6DFE6', '#CBD6DE')
    # the lifted board, with guides down to its slot
    bx0, bx1 = lifted, lifted + PAD
    ly = LIFT_Y
    for zz, yy in ((0, 0), (W, 0), (W, H), (0, H)):
        cv.line((X(bx1), Y(yy + 2), Z(zz)), (X(bx1), Y(ly + yy - 2), Z(zz)), '#5E9FBA', 1.1, 'stroke-dasharray="5 6" opacity="0.8"')
    cv.box(X(bx0), X(bx1), Y(ly), Y(ly + H), Z(0), Z(W), '#EAF6FA', '#DDF0F7', '#E3F3F9', '#4E93B0', 1.8, extra='fill-opacity="0.96"')
    # frosted texture on the board's broad face
    dots = []
    for row in range(7):
        for col in range(11):
            zz = 8 + col * 13.4 + (row % 2) * 6.7
            yy = 8 + row * 14
            if zz < W - 6:
                px, py = proj(X(bx1), Y(ly + yy), Z(zz))
                dots.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="1.1"/>')
    cv.raw('<g fill="#7FB4C8" opacity="0.55">' + ''.join(dots) + '</g>')
    # label anchor: the middle of the board's broad face
    return proj(X(bx1), Y(ly + H * 0.62), Z(W * 0.35))


DEFS = '''<defs>
  <filter id="soft" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
  <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="7" height="7" fill="#E4EAEF"/><line x1="0" y1="0" x2="0" y2="7" stroke="#2B4660" stroke-width="1.4" opacity="0.7"/>
  </pattern>
</defs>'''


def render(scene):
    cv = Canvas()
    if scene == 'ev':
        # pack tray with neighbouring modules, ghosted
        ghost_box(cv, -L - 70, L + 40, -22, -10, -2 * W - 110, W + 34)
        ghost_module(cv, dx=-L - 50, dz=-W - 50)
        ghost_module(cv, dx=0, dz=-W - 50)
        ghost_module(cv, dx=-L - 50, dz=0)
        anchor = module(cv)
    else:
        # rack: modules below on their shelves, posts at the corners, ghosted
        pitch = H + 54
        for k in (2, 1):
            ghost_box(cv, -34, L + 34, -k * pitch - 14, -k * pitch - 10, -26, W + 26)
            ghost_module(cv, dy=-k * pitch)
        ghost_box(cv, -34, L + 34, -14, -10, -26, W + 26)
        for px, pz in ((-34, -26), (L + 22, -26)):
            ghost_box(cv, px, px + 12, -2 * pitch - 40, H + 14, pz, pz + 12)
        anchor = module(cv)
        for px, pz in ((-34, W + 14), (L + 22, W + 14)):
            ghost_box(cv, px, px + 12, -2 * pitch - 40, H + 14, pz, pz + 12)
    # fit: frame the detailed module and the lifted board, let the ghosted context bleed off the edges
    xs, ys = [], []
    for x in (-14, L + 14):
        for y in (-10, H + 9, LIFT_Y + H):
            for z in (-8, W + 8):
                px, py = proj(x, y, z)
                xs.append(px); ys.append(py)
    xs.append(anchor[0] + 120); ys.append(anchor[1] - 60)
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    k = min((W_VB * 0.80) / (maxx - minx), (H_VB * 0.86) / (maxy - miny))
    tx = (W_VB - (maxx - minx) * k) / 2 - minx * k
    ty = (H_VB - (maxy - miny) * k) / 2 - miny * k + 6
    ax, ay = anchor[0] * k + tx, anchor[1] * k + ty
    lx, ly = ax + 110, ay - 70
    leader = (f'<polyline points="{ax:.1f},{ay:.1f} {lx - 40:.1f},{ly:.1f} {lx:.1f},{ly:.1f}" fill="none" stroke="#1F3B57" stroke-width="1.6" stroke-linejoin="round"/>'
              f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="5" fill="#fff" stroke="#1F3B57" stroke-width="1.6"/>')
    body = '\n'.join(cv.items)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W_VB} {H_VB}" width="{W_VB}" height="{H_VB}">\n{DEFS}\n'
           f'<g transform="translate({tx:.2f} {ty:.2f}) scale({k:.4f})">\n{body}\n</g>\n{leader}\n</svg>\n')
    return svg, (round(lx / W_VB * 100, 2), round(ly / H_VB * 100, 2))


def main(out):
    os.makedirs(out, exist_ok=True)
    callouts = {}
    for scene in ('ev', 'ess'):
        svg, pos = render(scene)
        open(os.path.join(out, f'application-{scene}.svg'), 'w', encoding='utf-8').write(svg)
        callouts[scene] = {'callout': pos}
        print(f'application-{scene}.svg', f'{len(svg) // 1024} KB', 'label at', pos)
    json.dump(callouts, open(os.path.join(out, 'callouts.json'), 'w'), indent=2)


if __name__ == '__main__':
    main(sys.argv[1])
