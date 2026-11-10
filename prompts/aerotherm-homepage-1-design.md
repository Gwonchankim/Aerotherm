Design the visual concept for the company homepage of **Aerotherm**, using GPT Image 2.6. This step is design only: do not write any HTML or CSS. In the next step, a developer will rebuild the page in code from the files you make here, so make them clear, consistent and easy to read.

**About Aerotherm (use only these facts)**
- A materials R&D company founded in October 2026 in Pyeongtaek, Republic of Korea.
- It develops nano-silica boards made with aerogel. Its flagship product, also called Aerotherm, goes between the cells of the secondary (rechargeable) batteries used in EVs and ESS.
- When one cell goes into thermal runaway because of a battery fault, the board suppresses or stops thermal propagation to the neighboring cells and to neighboring ESS containers.
- Its edge: typical aerogel insulation mainly suppresses heat transfer by convection. Aerotherm also strongly suppresses heat transfer by thermal radiation, which becomes a major heat path at thermal-runaway temperatures.

**How it insulates (four principles)**
1. Nanopores and the Knudsen effect: the pores inside the board are smaller than the mean free path of air molecules (about 70 nm at room temperature). The molecules hit the pore walls far more often than each other, so convection and conduction through the air are strongly suppressed.
2. Low solid conduction: silica (SiO₂) conducts heat poorly, and the board's porous solid structure leaves heat very few paths through the solid.
3. Radiation blocking: infrared opacifiers mixed into the nano-silica reflect or scatter the radiant heat produced at high temperatures.
4. Lower conductivity than still air: nano-silica insulation boards reach about 0.011–0.023 W/m·K, lower than still air, and insulate more than twice as well as styrofoam or glass wool in a thinner layer.

**Message and tone:** one failing cell should stay one failing cell. Calm, precise and trustworthy, for engineers and buyers at battery, EV and ESS makers. Show heat being stopped, not fire and explosions.

**Visual direction:** deep graphite and navy background. A heat ramp from ember red to orange for runaway, and ice cyan to white for protected cells. Show the material as a frosted, translucent pale-blue layer, like aerogel's "frozen smoke". Draw radiation as fine glowing infrared rays and convection as rising heat shimmer, so the two are easy to tell apart. Use precise technical cutaways, lab-grade detail and monoline icons, not stock photos. Keep the palette, line style and lighting the same across every file.

**Text in the images:** spell AEROTHERM correctly. Other text can be rough placeholders, since the page copy is written in the next step. The only numbers you may draw are "~70 nm" and "0.011–0.023 W/m·K" in the Technology section. Never draw specs, test results, certification marks or customer logos; show spec values as "—".

**Make these files**
1. `design/concept-desktop.png`: the full homepage at 1440 px wide, top to bottom, with these sections:
   1. Header: AEROTHERM wordmark; nav for About, Technology, Product, Applications, R&D, News, Contact; a KO / EN switch; a "Contact us" button.
   2. Hero: a one-line company mission, the hero visual, and two buttons (Explore our technology / Request a sample).
   3. About: who Aerotherm is and why thermal propagation matters.
   4. Technology: four panels, one per principle above (the fourth with a simple bar chart against still air), and a with/without Aerotherm comparison.
   5. Product: the board between cells, and a spec table.
   6. Applications: EV battery pack, and ESS rack and container.
   7. R&D and quality: lab, testing, patents and certifications.
   8. News and milestones: three cards; the first is the company's founding in October 2026.
   9. Contact: an inquiry form (name, company, email, inquiry type, message).
   10. Footer: Pyeongtaek, Republic of Korea; links; © 2026 Aerotherm.
2. `design/concept-mobile.png`: the same page at 390 px wide, with the menu collapsed.
3. `design/hero-loop.gif` (6–8 s, seamless loop): a cutaway battery module. One cell turns red-hot and sends out infrared rays and a rising heat shimmer. Both hit the translucent Aerotherm board and stop there. The neighboring cells stay cool blue. The heat fades and the loop restarts.
4. `design/principle-knudsen.gif` (seamless loop): a magnified nanopore network. Air molecules bounce off the pore walls rather than off each other, and heat barely moves through. A dashed line marks the ~70 nm mean free path, longer than the pore itself.
5. `design/principle-solid.gif` (seamless loop): heat tries to travel along the thin, branching silica skeleton and fades out along its long, narrow paths.
6. `design/principle-radiation.gif` (seamless loop): two panels side by side. Left, a typical aerogel layer: the convection shimmer stops, but the infrared rays pass through. Right, the Aerotherm board: opacifier particles inside it reflect and scatter the rays, so both the shimmer and the rays stop.
7. Six animated icons in `design/icons/` (square GIFs on the page background, one line weight): `rnd.gif` (aerogel materials R&D), `nanopore.gif` (nanopores and the Knudsen effect), `radiation.gif` (radiation blocking), `barrier.gif` (cell-to-cell barrier), `ev.gif` (EV battery pack), `ess.gif` (ESS container).
8. `design/loading.gif`: a temperature bar rises, meets a thin barrier line and holds there.
9. `design/style-notes.md`: a short handoff for the developer: colors as hex values, typefaces (Google Fonts), icon line weight, spacing scale, and for each GIF its key frames, timing and easing.

**Deliver** everything in `design/`, with a list of the files.
