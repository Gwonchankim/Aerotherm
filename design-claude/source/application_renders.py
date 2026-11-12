"""Prepare the two Applications renders for the homepage.

Reads  design/assets/application-{ev,ess}-render.png  (image-model output,
       generated from prompts/aerotherm-application-renders.md)
Writes site/assets/img/application-{ev,ess}-render-{640,1280}.webp

Two adjustments, both invisible on the subject itself:
- The ESS rack filled 98% of the image height, so it is scaled to 87.5% and
  centred on the same flat background, to give it the EV render's margins.
- The renders' flat background (#F2F7FA) is mapped to the page background
  (#F6F9FB) with a per-channel gain of at most 1.7%.

Usage: python3 design-claude/source/application_renders.py   (from the repo root)
"""
import os

import numpy as np
from PIL import Image

SRC = 'design/assets'
OUT = 'site/assets/img'
RENDER_BG = (242, 247, 250)   # #F2F7FA, measured in all four corners of both renders
PAGE_BG = (246, 249, 251)     # #F6F9FB, --color-bg
SCALE = {'ev': 1.0, 'ess': 0.875}
WIDTHS = (640, 1280)


def prepare(scene):
    im = Image.open(os.path.join(SRC, f'application-{scene}-render.png')).convert('RGB')
    s = SCALE[scene]
    if s != 1.0:
        small = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        canvas = Image.new('RGB', im.size, RENDER_BG)
        canvas.paste(small, ((im.width - small.width) // 2, (im.height - small.height) // 2))
        im = canvas
    a = np.asarray(im).astype(float) * np.array(PAGE_BG) / np.array(RENDER_BG)
    return Image.fromarray(np.clip(a + 0.5, 0, 255).astype('uint8'))


if __name__ == '__main__':
    for scene in SCALE:
        im = prepare(scene)
        for w in WIDTHS:
            path = os.path.join(OUT, f'application-{scene}-render-{w}.webp')
            im.resize((w, w * 9 // 16), Image.LANCZOS).save(path, quality=86, method=6)
            print(path, f'{os.path.getsize(path) // 1024} KB')
