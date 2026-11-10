Build the company homepage for **Aerotherm** as a real, working single page in HTML and CSS. Base it on the design files in `design/` from the previous step: `concept-desktop.png`, `concept-mobile.png`, `propagation-without.gif`, `propagation-with.gif`, `principle-knudsen.gif`, `principle-solid.gif`, `principle-radiation.gif`, the icons in `design/icons/`, `loading.gif` and `style-notes.md`.

**First, review the design**
Look at every image and GIF before you write any code. Note the layout, colors, type, spacing, and each animation's key frames and timing, using `style-notes.md` where it helps. Where the design conflicts with this prompt (garbled text, invented numbers or logos, a physically wrong picture), follow this prompt and note what you changed.

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

Present the figures in principle 4 as typical of nano-silica insulation boards, not as Aerotherm's own measured results; Aerotherm's measured thermal conductivity stays as `{{thermal_conductivity}}` in the spec table. Describe the radiation blocking only as infrared opacifiers mixed into the nano-silica, without naming specific materials or amounts.

Do not invent figures, history, people, test results, patents, certifications, partners or customers. It is a newly founded company, so do not imply a long track record, mass production or existing customers. Wherever the page needs a fact, put a clearly marked placeholder such as `{{thermal_conductivity}}`, `{{street_address}}` or `{{contact_email}}`.

**Copy:** a deep-tech materials company whose work keeps one failing battery cell from becoming a fire. Its edge is radiation: it blocks the heat that travels as radiation, not only the heat carried by convection that ordinary aerogel stops. Make that the thread through the hero, About and Technology. Keep the tone calm, precise and trustworthy, for engineers and buyers at battery, EV and ESS makers. Write in English, with a KO / EN switch in the header that links to `#` for now.

**Sections (one page with anchor navigation)**
1. Header: AEROTHERM wordmark; nav for About, Technology, Product, Applications, R&D, News, Contact; KO / EN switch; a "Contact us" button.
2. Hero: the company mission in one line, the hero animation (the with-Aerotherm propagation loop), and two calls to action (Explore our technology / Request a sample).
3. About: who Aerotherm is (founded October 2026 in Pyeongtaek, Korea) and why thermal propagation matters.
4. Technology: the four principles, each with its own animation (the Knudsen effect, solid conduction and radiation blocking) or chart (a bar chart of the typical 0.011–0.023 W/m·K range against still air), followed by the interactive with/without comparison.
5. Product: the board, where it sits between cells, and a spec table made of placeholders, including thermal conductivity and radiation-blocking performance.
6. Applications: EV battery packs (cell to cell) and ESS (cell to cell, rack and container).
7. R&D and quality: lab and test capabilities, patents and certifications, all as placeholders.
8. News and milestones: three cards. The first is the company's founding in October 2026; the other two are placeholders.
9. Contact: an inquiry form (name, company, email, inquiry type: sample, technical, partnership; message) that validates on the client and is not wired to a backend.
10. Footer: company info (Pyeongtaek, Republic of Korea, with street address, phone and email as placeholders), links and © 2026 Aerotherm.

**Build rules**
- All text is real HTML, not baked into images. The nav scrolls to each section, and collapses into a menu on mobile.
- Recreate the animations in code (CSS keyframes and inline SVG) instead of dropping the GIFs onto the page: the two propagation animations, the three principle animations, the icons and the loading state. Keep the propagation animations' stages and timing (3.2 s of motion, then a 1.5 s hold), and let the browser interpolate between stages so the motion is smooth. Build the bar chart in HTML or SVG.
- Make the with/without comparison interactive: a toggle or slider that switches between the two propagation animations, frame for frame. Without Aerotherm, heat cascades through every cell; with it, heat stops at the boards beside the failing cell.
- Convert any GIF you still need to a looping MP4 (muted, autoplay, playsinline, with a poster frame) or an animated WebP.
- Keep the page light throughout, as in the design, with text and heat colors that meet WCAG AA contrast on the light background.
- Make it responsive from 360 px to 1440 px and wider, following `concept-mobile.png` on small screens. Respect `prefers-reduced-motion` (show a static end state), and use semantic, accessible markup.

**Deliver**
- `index.html` and its `assets/` folder (CSS, JS, SVG, video, images), leaving `design/` as it is
- a list of every placeholder that needs real Aerotherm data
- a short note on where you departed from the design, and why
