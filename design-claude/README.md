# Propagation GIFs: Claude's version

A second take on the two thermal propagation GIFs, made from the same remake prompt as `design/`, so the two results can be compared side by side. Nothing in `design/` is changed.

| File | What it is |
| --- | --- |
| `propagation-without.gif` | One cell goes into thermal runaway and the heat spreads through the whole module. |
| `propagation-with.gif` | The same event with an Aerotherm board between every pair of cells; the heat stops at the boards. |
| `assets/hero-frame-32.png` | Frame 32 of `propagation-with.gif`, decoded from the GIF: the moment of impact. |
| `review/` | Frames 20, 32 and 60 of both GIFs as PNG stills. |
| `verification.json` | Measured structure and checks (see below). |
| `source/` | The renderer: `render.html` draws a frame on a canvas, `render.cjs` renders all 128 frames in headless Chromium, `build.py` assembles the GIFs and runs the checks. |

## Rebuild

```bash
node design-claude/source/render.cjs /tmp/aerotherm-frames
python3 design-claude/source/build.py /tmp/aerotherm-frames design-claude
```

## How it follows the prompt

- **Shared spec:** 1200 × 675 px, exactly 64 frames, 50 ms per frame with a 1,550 ms hold on frame 60 (4.7 s cycle), one global 256-color table shared by both GIFs, infinite loop, no text inside the GIFs.
- **Geometry:** five prismatic cells stacked broad face to broad face, two terminals each, narrow ends toward an oblique camera with depth receding up and to the right. Cell 70 × 250 × 320 units (thickness × broad-face width × height). Boards and gaps are 14 units, one fifth of a cell's thickness: **exaggerated for legibility, not a product dimension.**
- **Heat colors:** brand blue → a bright near-white glow → amber → orange → red, interpolated in OKLab, then red → ember. The glow point keeps the blue-to-amber change from going muddy gray or rainbow. The heat-front band is drawn with screen blending, so it lightens the cells instead of graying them.
- **Emphasis devices:** a visible heat front; the impact, where rays pile into the board, the hot line spreads along the board's face and along its top edge, and sparks scatter back; the hot/cool split across each board; a blue outline pulse peaking at frame 32 while everything else fades back; number-free gauges above each cell.
- **Loop:** frames 1–4 fade in from the background and frames 61–64 fade out to it, so the loop never jumps from a hot module to a cool one.

## Deviations

- The module fills about 60% of the canvas width, not 70%: at 70% the cells and gauges would not fit the 675 px height.
- Pillow merges identical consecutive frames, which would collapse the still opening. `build.py` toggles the bottom-right pixel between the background and its nearest palette color on alternate frames so all 64 frames are kept. The change is invisible.

## Checks (`verification.json`)

All pass: size, frame count, delays, a single global color table with no local tables, infinite loop, the same color table in both GIFs, frames 1–20 differing only at the boards (within 4 px for antialiasing and resampling), the four neighbors never warming in the GIF with Aerotherm, and no mid-lightness gray on the cells in the GIF without it.
