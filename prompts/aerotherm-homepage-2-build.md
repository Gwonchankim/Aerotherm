Build the company homepage for **Aerotherm** as a real, working single page in HTML and CSS. Base it on the design files in `design/` from the previous step: `concept-desktop.png`, `concept-mobile.png`, `hero-loop.gif`, `heat-transfer.gif`, the icons in `design/icons/`, `loading.gif` and `style-notes.md`.

**First, review the design**
Look at every image and GIF before you write any code. Note the layout, colors, type, spacing, and each animation's key frames and timing, using `style-notes.md` where it helps. Where the design conflicts with this prompt (garbled text, invented numbers or logos, a physically wrong picture), follow this prompt and note what you changed.

**Company and product facts (use only these)**
- Aerotherm was founded in October 2026 in Pyeongtaek, Republic of Korea.
- Aerotherm researches and develops nano-silica boards made with aerogel.
- Its flagship product, also called Aerotherm, goes between the cells of the secondary (rechargeable) batteries used in EVs and ESS.
- Its job: when one cell goes into thermal runaway because of a battery fault, the board suppresses or stops thermal propagation to the neighboring cells and to neighboring ESS containers.
- What sets it apart: typical aerogel insulation mainly suppresses heat transfer by convection. Aerotherm keeps that and is also highly effective at suppressing heat transfer by thermal radiation.
- Why that matters (general physics, not a product claim): radiative heat transfer rises with the fourth power of absolute temperature, so at thermal-runaway temperatures radiation becomes a major path for heat between cells.

Do not invent figures, history, people, test results, patents, certifications, partners or customers, and do not explain how Aerotherm blocks radiation (materials, additives or structure). It is a newly founded company, so do not imply a long track record, mass production or existing customers. Wherever the page needs a fact, put a clearly marked placeholder such as `{{thermal_conductivity}}`, `{{street_address}}` or `{{contact_email}}`.

**Copy:** a deep-tech materials company whose work keeps one failing battery cell from becoming a fire. Its edge is radiation: it blocks the heat that travels as radiation, not only the heat carried by convection that ordinary aerogel stops. Make that the thread through the hero, About and Technology. Keep the tone calm, precise and trustworthy, for engineers and buyers at battery, EV and ESS makers. Write in English, with a KO / EN switch in the header that links to `#` for now.

**Sections (one page with anchor navigation)**
1. Header: AEROTHERM wordmark; nav for About, Technology, Product, Applications, R&D, News, Contact; KO / EN switch; a "Contact us" button.
2. Hero: the company mission in one line, the hero animation, and two calls to action (Explore our technology / Request a sample).
3. About: who Aerotherm is (founded October 2026 in Pyeongtaek, Korea) and why thermal propagation matters.
4. Technology: the animated convection and radiation diagram, a macro view of the nano-silica structure, and the interactive with/without comparison.
5. Product: the board, where it sits between cells, and a spec table made of placeholders, including radiation-blocking performance.
6. Applications: EV battery packs (cell to cell) and ESS (cell to cell, rack and container).
7. R&D and quality: lab and test capabilities, patents and certifications, all as placeholders.
8. News and milestones: three cards. The first is the company's founding in October 2026; the other two are placeholders.
9. Contact: an inquiry form (name, company, email, inquiry type: sample, technical, partnership; message) that validates on the client and is not wired to a backend.
10. Footer: company info (Pyeongtaek, Republic of Korea, with street address, phone and email as placeholders), links and © 2026 Aerotherm.

**Build rules**
- All text is real HTML, not baked into images. The nav scrolls to each section, and collapses into a menu on mobile.
- Recreate the animations in code (CSS keyframes and inline SVG) instead of dropping the GIFs onto the page: the hero loop, the heat-transfer diagram, the icons and the loading state.
- Make the with/without comparison interactive: a toggle or slider that shows heat cascading through every cell without Aerotherm, and stopping at the first board with it.
- Convert any GIF you still need to a looping MP4 (muted, autoplay, playsinline, with a poster frame) or an animated WebP.
- Make it responsive from 360 px to 1440 px and wider, following `concept-mobile.png` on small screens. Respect `prefers-reduced-motion` (show a static end state), and use semantic, accessible markup.

**Deliver**
- `index.html` and its `assets/` folder (CSS, JS, SVG, video, images), leaving `design/` as it is
- a list of every placeholder that needs real Aerotherm data
- a short note on where you departed from the design, and why
