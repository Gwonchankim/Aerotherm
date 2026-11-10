Design and build the launch of the new company homepage for **Aerotherm**, a materials R&D company that develops aerogel-based nano-silica boards with outstanding thermal insulation.

**Company and product facts (use only these)**
- Aerotherm was founded in October 2026 in Pyeongtaek, Republic of Korea.
- Aerotherm researches and develops nano-silica boards made with aerogel.
- Its flagship product, also called Aerotherm, goes between the cells of the secondary (rechargeable) batteries used in EVs and ESS.
- Its job: when one cell goes into thermal runaway because of a battery fault, the board suppresses or stops thermal propagation to the neighboring cells and to neighboring ESS containers.
- What sets it apart: typical aerogel insulation mainly suppresses heat transfer by convection. Aerotherm keeps that and is also highly effective at suppressing heat transfer by thermal radiation.
- Why that matters (general physics, not a product claim): radiative heat transfer rises with the fourth power of absolute temperature, so at thermal-runaway temperatures radiation becomes a major path for heat between cells.

Do not invent figures, history, people, test results, patents, certifications, partners or customers, and do not explain how Aerotherm blocks radiation (materials, additives or structure). It is a newly founded company, so do not imply a long track record, mass production or existing customers. Wherever the page needs a fact, put a clearly marked placeholder such as `{{thermal_conductivity}}`, `{{street_address}}` or `{{contact_email}}`, and list every placeholder when you deliver.

**Positioning:** a deep-tech materials company whose work keeps one failing battery cell from becoming a fire. Its edge is radiation: it blocks the heat that travels as radiation, not only the heat carried by convection that ordinary aerogel stops. Make that the thread through the hero, About and Technology. Keep the tone calm, precise and trustworthy, for engineers and buyers at battery, EV and ESS makers. Show heat being stopped, not fire and explosions. Write the copy in English, with a KO / EN switch in the header (it can link to `#` for now).

**Site structure (one page with anchor navigation)**
1. Header: AEROTHERM wordmark; nav for About, Technology, Product, Applications, R&D, News, Contact; a "Contact us" button.
2. Hero: the company mission in one line, the hero animation, and two calls to action (Explore our technology / Request a sample).
3. About: who Aerotherm is (founded October 2026 in Pyeongtaek, Korea) and why thermal propagation matters.
4. Technology: the three ways heat travels (conduction, convection, radiation) in an animated diagram. Typical aerogel mainly suppresses convection; Aerotherm also suppresses radiation. Add a macro view of the nano-silica structure and an interactive with/without Aerotherm comparison.
5. Product: the Aerotherm board, where it sits between cells, and a spec table made of placeholders, including radiation-blocking performance.
6. Applications: EV battery packs (cell to cell) and ESS (cell to cell, rack and container).
7. R&D and quality: lab and test capabilities, patents and certifications, all as placeholders.
8. News and milestones: three cards. The first is the company's founding in October 2026; the other two are placeholders.
9. Contact: an inquiry form (name, company, email, inquiry type: sample, technical, partnership; message) that validates on the client and is not wired to a backend.
10. Footer: company info (Pyeongtaek, Republic of Korea, with street address, phone and email as placeholders), links and © 2026 Aerotherm.

**Step 1: Design with GPT Image 2.6**
1. A full-page concept image of the homepage (desktop, 1440 px wide) showing every section above.
2. An animated hero loop (GIF, 6–8 s, seamless) as the company's signature visual: a cutaway battery module. One cell turns red-hot and sends out infrared radiation, drawn as fine glowing rays, along with a rising heat shimmer. Both hit the translucent Aerotherm board and stop there. The neighboring cells stay cool blue. The heat fades and the loop restarts.
3. Six animated icons (GIF, one consistent line style): aerogel materials R&D, radiation blocking, convection suppression, cell-to-cell barrier, EV battery pack, ESS container.
4. A loading state (GIF): a temperature bar rises, meets a thin barrier line and holds there.

Visual direction: deep graphite and navy background. A heat ramp from ember red to orange for runaway, and ice cyan to white for protected cells. Show the material as a frosted, translucent pale-blue layer, like aerogel's "frozen smoke". Draw radiation as fine glowing infrared rays and convection as rising heat shimmer, so the two are easy to tell apart. Use precise technical cutaways, lab-grade detail and monoline icons, not stock photos. Treat any text the image model draws as a placeholder.

**Step 2: Rebuild it as a real page in HTML and CSS**
- Rebuild the design as a working single page that matches the concept. All text is real HTML, not baked into images, and the nav scrolls to each section.
- Recreate the animations in code (CSS keyframes and inline SVG) instead of dropping the GIFs onto the page: the hero propagation loop, the heat-transfer diagram, the icons and the loading state.
- Make the with/without comparison interactive: a toggle or slider that shows heat cascading through every cell without Aerotherm, and stopping at the first board with it.
- Convert any GIF you still need to a looping MP4 (muted, autoplay, playsinline, with a poster frame) or an animated WebP.
- Make it responsive from 360 px to 1440 px and wider, with a mobile menu. Respect `prefers-reduced-motion` (show a static end state), and use semantic, accessible markup.

**Deliver**
- `index.html` and its `assets/` folder (CSS, JS, SVG, video, images)
- the generated design images in `design/` (concept image, hero GIF, icon GIFs, loading GIF)
- a list of every placeholder that needs real Aerotherm data
