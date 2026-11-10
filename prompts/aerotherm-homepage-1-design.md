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

**Visual direction:** a light, clean page: a white or very pale cool-gray background, with deep navy and graphite for text, lines and icons. A heat ramp from amber through orange to deep red for runaway, and a clear cool blue for protected cells (not white, so they stand out from the background). Show the material as a frosted, translucent pale-blue layer, like aerogel's "frozen smoke", with a thin crisp edge so it reads against the light background. Draw radiation as fine orange-red infrared rays with a soft glow and convection as rising heat shimmer, so the two are easy to tell apart. Every image and GIF, including the icons and the propagation GIFs, uses the same light background. Use precise technical cutaways, lab-grade detail and monoline icons, not stock photos. Keep the palette, line style and lighting the same across every file.

**How to draw the cells and boards** (in every image and GIF that shows them): each cell is a prismatic cell, a tall, flat, brushed-metal can with two terminals on top. If a reference image of a cell is attached, match its shape, finish and terminals. Stack the cells face to face, the way they sit in a real module: the camera looks at the cells' thin narrow ends, so each cell appears as a tall, narrow slab, and the broad faces of neighboring cells face each other. A cell's narrow end is about a quarter to a third as wide as its broad face. Each Aerotherm board is a thin sheet sandwiched between the broad faces of two neighboring cells, about the same width and height as a broad face so that it covers it almost completely, and clearly thinner than a cell (about a tenth of a cell's thickness). Turn the camera about 20–30° off the front and slightly above it, so the depth of the stack, and the boards' full area between the broad faces, can be seen. Do not line the cells up with their broad faces toward the camera, and do not put the boards between the cells' narrow edges.

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
3. Two matched GIFs of the same thermal runaway, one without Aerotherm and one with it. Make each one from exactly **64 frames**, at the same canvas size (1200 × 675 px), with the same camera angle and lighting. Show each frame for 50 ms (20 fps, 3.2 s of motion), and hold frame 64 for about 1.5 s before the loop restarts at frame 1. Both show five prismatic cells stacked face to face in a cutaway battery module, drawn as described in **How to draw the cells and boards**, and the runaway starts in the middle cell (cell 3). Keep the cells in the same positions in both; in the GIF without Aerotherm, the gaps where the boards go are empty. Frames 1–16 are the same in both apart from the boards, and each frame lines up with the same frame in the other GIF, so the two can be compared side by side. Show heat as glow, infrared rays and heat shimmer, with no flames or explosions.

   The GIF with Aerotherm must make the blocking moment unmistakable: the eye should go straight to the boards stopping the heat. Use these devices, in both GIFs where they apply, so the two stay comparable:
   - A heat front: heat leaves cell 3 through its broad faces as a visible front of bright orange-red infrared rays and heat shimmer, moving toward its neighbors.
   - The impact: where a board stands in its way, the front hits it and stops dead. It flattens and spreads across the board's hot face like a wave meeting a wall, and some rays scatter back off it.
   - A hard hot/cool line: the board's face toward cell 3 glows bright orange while its far face stays cool blue, so the module splits into a red zone and a blue zone exactly at the board.
   - A highlight: at the moment of impact, a thin cool-blue outline pulses once around the two boards beside cell 3, and the rest of the module dims slightly so the boards stand out, then eases back.
   - Temperature gauges: a small vertical gauge above each cell, with no numbers, fills and shifts from blue to red as that cell heats, so anyone can see at a glance which cells are hot.

   Keep the motion smooth: from one frame to the next, change only these effects and the heat colors, never the camera, cells or boards, and let each frame differ only slightly from the one before so nothing jumps. Ease into and out of each stage. Use one global color palette for every frame so the colors don't flicker.
   - `design/propagation-without.gif`: no barrier between the cells, so thermal propagation spreads through the module.
     - Frames 1–8: all five cells are cool blue, and every gauge is low.
     - Frames 9–16: cell 3 heats from orange to red-hot, and its gauge fills to the top.
     - Frames 17–32: cell 3 vents a thin wisp of gas, and its heat front crosses the empty gaps straight into cells 2 and 4, which turn orange as their gauges climb.
     - Frames 33–48: cells 2 and 4 turn red-hot and send their own heat fronts into cells 1 and 5.
     - Frames 49–64: cells 1 and 5 turn red-hot. By frame 64 every gauge is full and the whole module is in thermal runaway.
   - `design/propagation-with.gif`: a translucent Aerotherm board between the broad faces of every pair of neighboring cells (four boards), and the boards stop thermal propagation.
     - Frames 1–8: all five cells are cool blue, with the boards in place, and every gauge is low.
     - Frames 9–16: as in the other GIF, cell 3 heats from orange to red-hot, and its gauge fills to the top.
     - Frames 17–24: cell 3 vents a thin wisp of gas, and its heat front moves out toward the two boards beside it.
     - Frames 25–32: the impact. The front hits both boards and stops dead, flattening across their hot faces while some rays scatter back. The hot/cool line appears at each board, the outline pulses, and the rest of the module dims.
     - Frames 33–48: cell 3 stays red-hot and keeps pressing heat against the boards, which hold. Cells 2 and 4 and their gauges stay cool blue, and the dimming eases back.
     - Frames 49–64: cell 3 dims to a dark ember and the boards' hot faces fade. The other four cells are still cool blue, and only cell 3's gauge is high.

   Use frame 32 of `propagation-with.gif` (the heat front stopped at the boards) as the hero visual in the concept images.
4. `design/principle-knudsen.gif` (seamless loop): a magnified nanopore network. Air molecules bounce off the pore walls rather than off each other, and heat barely moves through. A dashed line marks the ~70 nm mean free path, longer than the pore itself.
5. `design/principle-solid.gif` (seamless loop): heat tries to travel along the thin, branching silica skeleton and fades out along its long, narrow paths.
6. `design/principle-radiation.gif` (seamless loop): two panels side by side. Left, a typical aerogel layer: the convection shimmer stops, but the infrared rays pass through. Right, the Aerotherm board: opacifier particles inside it reflect and scatter the rays, so both the shimmer and the rays stop.
7. Six animated icons in `design/icons/` (square GIFs on the page background, one line weight): `rnd.gif` (aerogel materials R&D), `nanopore.gif` (nanopores and the Knudsen effect), `radiation.gif` (radiation blocking), `barrier.gif` (cell-to-cell barrier), `ev.gif` (EV battery pack), `ess.gif` (ESS container).
8. `design/loading.gif`: a temperature bar rises, meets a thin barrier line and holds there.
9. `design/style-notes.md`: a short handoff for the developer: colors as hex values, typefaces (Google Fonts), icon line weight, spacing scale, and for each GIF its key frames, timing and easing.

**Deliver** everything in `design/`, with a list of the files.
