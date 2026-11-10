Design the visual concept for the company homepage of **Aerotherm**, using GPT Image 2.6. This step is design only: do not write any HTML or CSS. In the next step, a developer will rebuild the page in code from the files you make here, so make them clear, consistent and easy to read.

**About Aerotherm (use only these facts)**
- A materials R&D company founded in October 2026 in Pyeongtaek, Republic of Korea.
- It develops nano-silica boards made with aerogel. Its flagship product, also called Aerotherm, goes between the cells of the secondary (rechargeable) batteries used in EVs and ESS.
- When one cell goes into thermal runaway because of a battery fault, the board suppresses or stops thermal propagation to the neighboring cells and to neighboring ESS containers.
- Its edge: typical aerogel insulation mainly suppresses heat transfer by convection. Aerotherm also strongly suppresses heat transfer by thermal radiation, which becomes a major heat path at thermal-runaway temperatures.

**Message and tone:** one failing cell should stay one failing cell. Calm, precise and trustworthy, for engineers and buyers at battery, EV and ESS makers. Show heat being stopped, not fire and explosions.

**Visual direction:** deep graphite and navy background. A heat ramp from ember red to orange for runaway, and ice cyan to white for protected cells. Show the material as a frosted, translucent pale-blue layer, like aerogel's "frozen smoke". Draw radiation as fine glowing infrared rays and convection as rising heat shimmer, so the two are easy to tell apart. Use precise technical cutaways, lab-grade detail and monoline icons, not stock photos. Keep the palette, line style and lighting the same across every file.

**Text in the images:** spell AEROTHERM correctly. Other text can be rough placeholders, since the page copy is written in the next step. Never draw specs, test results, certification marks or customer logos; show spec values as "—".

**Make these files**
1. `design/concept-desktop.png`: the full homepage at 1440 px wide, top to bottom, with these sections:
   1. Header: AEROTHERM wordmark; nav for About, Technology, Product, Applications, R&D, News, Contact; a KO / EN switch; a "Contact us" button.
   2. Hero: a one-line company mission, the hero visual, and two buttons (Explore our technology / Request a sample).
   3. About: who Aerotherm is and why thermal propagation matters.
   4. Technology: how heat moves between cells by convection and by radiation, a macro view of the nano-silica structure, and a with/without Aerotherm comparison.
   5. Product: the board between cells, and a spec table.
   6. Applications: EV battery pack, and ESS rack and container.
   7. R&D and quality: lab, testing, patents and certifications.
   8. News and milestones: three cards; the first is the company's founding in October 2026.
   9. Contact: an inquiry form (name, company, email, inquiry type, message).
   10. Footer: Pyeongtaek, Republic of Korea; links; © 2026 Aerotherm.
2. `design/concept-mobile.png`: the same page at 390 px wide, with the menu collapsed.
3. `design/hero-loop.gif` (6–8 s, seamless loop): a cutaway battery module. One cell turns red-hot and sends out infrared rays and a rising heat shimmer. Both hit the translucent Aerotherm board and stop there. The neighboring cells stay cool blue. The heat fades and the loop restarts.
4. `design/heat-transfer.gif` (seamless loop): two panels side by side. Left, a typical aerogel layer: the convection shimmer stops, but the infrared rays pass through. Right, the Aerotherm board: both the shimmer and the rays stop.
5. Six animated icons in `design/icons/` (square GIFs on the page background, one line weight): `rnd.gif` (aerogel materials R&D), `radiation.gif` (radiation blocking), `convection.gif` (convection suppression), `barrier.gif` (cell-to-cell barrier), `ev.gif` (EV battery pack), `ess.gif` (ESS container).
6. `design/loading.gif`: a temperature bar rises, meets a thin barrier line and holds there.
7. `design/style-notes.md`: a short handoff for the developer: colors as hex values, typefaces (Google Fonts), icon line weight, spacing scale, and for each GIF its key frames, timing and easing.

**Deliver** everything in `design/`, with a list of the files.
