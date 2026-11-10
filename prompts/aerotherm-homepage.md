Design and build the launch of the new company homepage for **Aerotherm**, a materials R&D company that develops aerogel-based nano-silica boards with outstanding thermal insulation.

**Company and product facts (use only these)**
- Aerotherm researches and develops nano-silica boards made with aerogel.
- Its flagship product, also called Aerotherm, goes between the cells of the secondary (rechargeable) batteries used in EVs and ESS.
- Its job: when one cell goes into thermal runaway because of a battery fault, the board suppresses or stops thermal propagation to the neighboring cells and to neighboring ESS containers.
- How it works: the aerogel's nanoscale pores trap air and block heat transfer, so heat crosses the board very slowly.

Do not invent figures, history, people, test results, patents, certifications, partners or customers. Wherever the page needs one, put a clearly marked placeholder such as `{{founded_year}}`, `{{thermal_conductivity}}`, `{{address}}` or `{{contact_email}}`, and list every placeholder when you deliver.

**Positioning:** a deep-tech materials company whose work keeps one failing battery cell from becoming a fire. Keep the tone calm, precise and trustworthy, for engineers and buyers at battery, EV and ESS makers. Show heat being stopped, not fire and explosions. Write the copy in English, with a KO / EN switch in the header (it can link to `#` for now).

**Site structure (one page with anchor navigation)**
1. Header: AEROTHERM wordmark; nav for About, Technology, Product, Applications, R&D, News, Contact; a "Contact us" button.
2. Hero: the company mission in one line, the hero animation, and two calls to action (Explore our technology / Request a sample).
3. About: who Aerotherm is and why thermal propagation matters.
4. Technology: aerogel nano-silica explained, with a macro view of the nanopore structure and an interactive with/without Aerotherm comparison.
5. Product: the Aerotherm board, where it sits between cells, and a spec table made of placeholders.
6. Applications: EV battery packs (cell to cell) and ESS (cell to cell, rack and container).
7. R&D and quality: lab and test capabilities, patents and certifications, all as placeholders.
8. News and milestones: three placeholder cards.
9. Contact: an inquiry form (name, company, email, inquiry type: sample, technical, partnership; message) that validates on the client and is not wired to a backend.
10. Footer: company info placeholders, links and copyright.

**Step 1: Design with GPT Image 2.6**
1. A full-page concept image of the homepage (desktop, 1440 px wide) showing every section above.
2. An animated hero loop (GIF, 6–8 s, seamless) as the company's signature visual: a cutaway battery module. One cell turns red-hot, a heat wave moves outward, hits the translucent Aerotherm board and stops there. The neighboring cells stay cool blue. The heat fades and the loop restarts.
3. Six animated icons (GIF, one consistent line style): aerogel materials R&D, nanopore insulation, cell-to-cell barrier, propagation stopped, EV battery pack, ESS container.
4. A loading state (GIF): a temperature bar rises, meets a thin barrier line and holds there.

Visual direction: deep graphite and navy background. A heat ramp from ember red to orange for runaway, and ice cyan to white for protected cells. Show the material as a frosted, translucent pale-blue layer, like aerogel's "frozen smoke". Use precise technical cutaways, lab-grade detail and monoline icons, not stock photos. Treat any text the image model draws as a placeholder.

**Step 2: Rebuild it as a real page in HTML and CSS**
- Rebuild the design as a working single page that matches the concept. All text is real HTML, not baked into images, and the nav scrolls to each section.
- Recreate the animations in code (CSS keyframes and inline SVG) instead of dropping the GIFs onto the page: the hero propagation loop, the icons and the loading state.
- Make the with/without comparison interactive: a toggle or slider that shows heat cascading through every cell without Aerotherm, and stopping at the first board with it.
- Convert any GIF you still need to a looping MP4 (muted, autoplay, playsinline, with a poster frame) or an animated WebP.
- Make it responsive from 360 px to 1440 px and wider, with a mobile menu. Respect `prefers-reduced-motion` (show a static end state), and use semantic, accessible markup.

**Deliver**
- `index.html` and its `assets/` folder (CSS, JS, SVG, video, images)
- the generated design images in `design/` (concept image, hero GIF, icon GIFs, loading GIF)
- a list of every placeholder that needs real Aerotherm data
