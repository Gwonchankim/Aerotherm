Build the Aerotherm company homepage as a real, working single page in HTML, CSS and a little vanilla JavaScript, from the design files already in this repository. Put the site in `site/`: `site/index.html` and `site/assets/`. Leave `design/` and `design-claude/` as they are.

**The design files**
| File | Use it for |
| --- | --- |
| `design/concept-desktop.png` (1440 px wide), `design/concept-mobile.png` (390 px wide) | Layout, section order, hierarchy and starting copy, at both sizes. Their hero image is out of date: use the propagation animation below instead. |
| `design/style-notes.md` | Colors (hex), type scale, spacing scale, grid, control sizes, and every animation's keyframes and timing. |
| `design/fonts/` | Manrope (headings and wordmark) and Inter (UI and body), with their OFL licenses. Self-host them with `@font-face` and ship the licenses. |
| `design/propagation-without.gif`, `design/propagation-with.gif`, `design/assets/hero-frame-32.png` | The thermal propagation animation: the hero (with Aerotherm) and the Technology comparison (both). |
| `design-claude/source/render.html` | The exact drawing code for that animation: geometry, heat colors, timing and emphasis effects. |
| `design/principle-knudsen.gif`, `design/principle-solid.gif`, `design/principle-radiation.gif` | The three animated Technology panels. |
| `design/icons/*.gif`, `design/loading.gif` | The six icons and the loading state. |
| `design/assets/application-ev.png`, `design/assets/application-ess.png`, `design/assets/lab-concept.png` | The Applications and R&D illustrations. Use them as provided, converted to WebP at the sizes the layout needs. |
| `design/README.md`, `design/generation-prompts.json`, `design/verification.json`, `design/preview.png`, `design/assets/board-material.png` | Background only; not for the page. |

**Company and product facts (use only these)**
- Aerotherm was founded in October 2026 in Pyeongtaek, Republic of Korea.
- Aerotherm researches and develops nano-silica boards made with aerogel.
- Its flagship product, also called Aerotherm, goes between the cells of the secondary (rechargeable) batteries used in EVs and ESS.
- Its job: when one cell goes into thermal runaway because of a battery fault, the board suppresses or stops thermal propagation to the neighboring cells and to neighboring ESS containers.
- What sets it apart: typical aerogel insulation mainly suppresses heat transfer by convection. Aerotherm keeps that and is also highly effective at suppressing heat transfer by thermal radiation.
- Why that matters (general physics, not a product claim): radiative heat transfer rises with the fourth power of absolute temperature, so at thermal-runaway temperatures radiation becomes a major path for heat between cells.

**How it insulates (four principles)**
1. Nanopores and the Knudsen effect: the pores inside the board are smaller than the mean free path of air molecules (about 70 nm at room temperature). The molecules hit the pore walls far more often than each other, so convection and conduction through the air are strongly suppressed.
2. Low solid conduction: silica (SiO₂) conducts heat poorly, and the board's porous solid structure leaves heat very few paths through the solid.
3. Radiation blocking: infrared opacifiers mixed into the nano-silica reflect or scatter the radiant heat produced at high temperatures.
4. Lower conductivity than still air: nano-silica insulation boards reach about 0.011–0.023 W/m·K, lower than still air (about 0.026 W/m·K at room temperature), and insulate more than twice as well as styrofoam or glass wool in a thinner layer.

Present the figures in principle 4 as typical of nano-silica insulation boards, not as Aerotherm's own measured results. Describe the radiation blocking only as infrared opacifiers mixed into the nano-silica, without naming specific materials or amounts. Do not invent figures, history, people, test results, patents, certifications, partners or customers. It is a newly founded company, so do not imply a long track record, mass production or existing customers.

**Placeholders:** wherever the page needs a fact that is not above (Aerotherm's measured specs, street address, phone, email, patents, certifications, later news), write a visible token such as `{{thermal_conductivity}}` or `{{contact_email}}`, styled with a subtle dashed outline so nothing unfilled can ship unnoticed.

**Copy**
Start from the copy in the concept images, keep it within the facts, and write in English, with a KO / EN switch in the header that links to `#` for now. Radiation is the company's edge: make it the thread through the hero, About and Technology. Keep the tone calm, precise and trustworthy, for engineers and buyers at battery, EV and ESS makers. Fix these points from the concepts:
- The "Lower conductivity than still air" panel must say these boards insulate more than twice as well as styrofoam or glass wool in a thinner layer, and label 0.011–0.023 W/m·K as typical of the material class.
- The Product spec table gains a "Radiation-blocking performance" row. Every value in it is a placeholder.

**Sections:** follow the concepts: header (AEROTHERM wordmark; About, Technology, Product, Applications, R&D, News, Contact; KO / EN; "Contact us"), hero, About, Technology (four principle panels, then "One event. Two outcomes."), Product, Applications (EV battery pack; ESS rack and container), R&D and quality, News and milestones (the first card is the founding in October 2026; the other two are placeholders), Contact, footer (Pyeongtaek, Republic of Korea; © 2026 Aerotherm).

**The propagation animation (the page's centerpiece)**
- Draw it live in a `<canvas>` by reusing the drawing code in `design-claude/source/render.html`. Its `draw(variant, frame)` renders any frame, and its timing functions accept fractional frames, so drive the frame from elapsed time (frame = 1 + elapsed / 50 ms, holding frame 60 for 1.5 s) and redraw on every animation frame for smooth motion. Adapt it where needed: size the canvas to its container and the device pixel ratio, and make the fade-in and fade-out (a table keyed by whole frames) work with fractional frames.
- Hero: the animation with Aerotherm, looping.
- "One event. Two outcomes.": both animations side by side on desktop and stacked on mobile, driven by one shared clock so they stay frame-aligned. Add play/pause and a scrubber (a range input) that moves both through the event together.
- Give each canvas `role="img"` and an `aria-label` that says what happens. With `prefers-reduced-motion`, show still frames instead: frame 32 for the version with Aerotherm, frame 60 for the version without. Without JavaScript, show `hero-frame-32.png`. Pause the animations while they are off screen.

**Other animations:** recreate the three principle panels, the six icons and the loading state in CSS keyframes and inline SVG, following the keyframes table in `style-notes.md`. Do not put the GIFs on the page. Give the icons a transparent background so they sit cleanly on white cards.

**Build rules**
- A static site: vanilla HTML, CSS and JavaScript, no framework and no build step. It works opened from disk or from any static server.
- Put the colors, type, spacing and radii from `style-notes.md` into CSS custom properties.
- Keep the page light throughout, with text and heat colors that meet WCAG AA contrast on the light background.
- Make it responsive from 360 px to 1440 px and wider, following `concept-mobile.png` on small screens, with a mobile menu and no horizontal scrolling. The nav scrolls smoothly to each section.
- Use semantic, accessible markup: landmarks, ordered headings, labelled form fields, visible focus states and alt text.
- The contact form validates on the client and is not wired to a backend; say so in a short note under the button.
- Give images explicit sizes and lazy-load those below the fold; preload the two fonts with `font-display: swap`.

**Check before you deliver**
- Open the page in a browser at 390 px and 1440 px, compare it with the concepts, and fix any overflow or broken layout.
- Confirm the animations run, the scrubber and play/pause work, reduced motion shows the still frames, and the form validates.
- Save full-page screenshots at both widths in `site/review/`.

**Deliver**
- `site/index.html` and `site/assets/` (CSS, JS, fonts, images)
- the screenshots in `site/review/`
- a list of every placeholder that needs real Aerotherm data
- a short note on where you departed from the design, and why
