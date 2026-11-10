# Aerotherm visual concept

The complete design handoff is in this folder. Start with `concept-desktop.png`, `concept-mobile.png` and `style-notes.md`.

## Requested files

```text
design/
├── concept-desktop.png
├── concept-mobile.png
├── propagation-without.gif
├── propagation-with.gif
├── principle-knudsen.gif
├── principle-solid.gif
├── principle-radiation.gif
├── loading.gif
├── style-notes.md
└── icons/
    ├── rnd.gif
    ├── nanopore.gif
    ├── radiation.gif
    ├── barrier.gif
    ├── ev.gif
    └── ess.gif
```

## Supporting files

```text
design/
├── README.md
├── generation-prompts.json
├── verification.json
├── preview.png
├── assets/
│   ├── hero-frame-32.png
│   ├── board-material.png
│   ├── application-ev.png
│   ├── application-ess.png
│   └── lab-concept.png
└── fonts/
    ├── Manrope.ttf
    ├── Manrope-OFL.txt
    ├── Inter.ttf
    └── Inter-OFL.txt
```

The propagation GIFs each contain exactly 64 frames at 1200 × 675 px, with 50 ms frame timing and a 1500 ms additional hold on the last frame. The supplied hero PNG is an exact decode of protected frame 32. Scientific animations, applications and lab imagery are illustrative; no test results, certification marks, customer logos or unsupplied specs are asserted.

The built-in image generator was used for visual exploration and source illustrations. It did not expose a GPT Image 2.6 selector. Final page typography and scientific motion were assembled as raster artwork; no HTML or CSS is included. See `generation-prompts.json` for the prompts and `style-notes.md` for all timing, geometry, typography and palette details.
