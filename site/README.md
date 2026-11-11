# AeroTherm homepage

A static single page in two languages: `index.html` (English) and `ko/index.html` (Korean), sharing `assets/` (CSS, JavaScript, fonts, images). No framework and no build step. Open either file from disk or serve the folder from any static server. Pushing changes under `site/` to the default branch publishes them to GitHub Pages (`.github/workflows/pages.yml`).

```text
site/
├── index.html                English page
├── ko/index.html             Korean page (same structure, translated text)
├── assets/
│   ├── css/styles.css        design tokens (custom properties) and all styles
│   ├── js/propagation.js     canvas renderer, ported from design-claude/source/render.html
│   ├── js/main.js            animation clocks and controls, menu, landing on #links, EN/KO interface text
│   ├── fonts/                Manrope and Inter (WOFF2), Pretendard for Hangul, with their OFL licenses
│   └── img/                  logo and favicon (SVG), WebP illustrations, the two no-JavaScript stills
└── review/                   screenshots of the built pages
```

## Placeholders that need real AeroTherm data

Every unfilled fact is a visible `{{token}}` with a dashed outline. Search `index.html` and `ko/index.html` for `{{` to find them all; both pages use the same tokens.

| Token | Where | What is needed |
| --- | --- | --- |
| `{{thermal_conductivity}}` | Technology, "Thermal conductivity at room temperature" panel; Product spec table | AeroTherm's measured thermal conductivity, with unit |
| `{{test_conditions}}` | Technology, conductivity panel | Conditions of that measurement: temperature, method or standard |
| `{{conductivity_source}}` | Technology, conductivity panel | A citable source for the 0.011–0.023 W/m·K range of nano-silica insulation boards, or remove the range |
| `{{material_grade}}` | Product spec table | Grade or product designation |
| `{{thickness}}` | Product spec table | Board thickness or range |
| `{{dimensions}}` | Product spec table | Board sizes offered |
| `{{density}}` | Product spec table | Density, with unit |
| `{{radiation_blocking}}` | Product spec table, "Radiation-blocking performance" row | The measured figure and its test method |
| `{{temperature_range}}` | Product spec table | Service temperature range |
| `{{thermal_test_methods}}` | R&D, "Thermal evaluation" | Test methods or standards used |
| `{{patents}}` | R&D, "Patents" | Patent or application details, or remove the item |
| `{{certifications}}` | R&D, "Certifications" | Certifications held, or remove the item |
| `{{news_2_title}}`, `{{news_2_summary}}`, `{{news_2_date}}` | News, second card (Research) | A real news item, or remove the card |
| `{{news_3_title}}`, `{{news_3_summary}}`, `{{news_3_date}}` | News, third card (Announcements) | A real news item, or remove the card |
| `{{street_address}}` | Contact | Street address in Pyeongtaek |
| `{{contact_phone}}` | Contact | Phone number |
| `{{contact_email}}` | Contact | Email address |

Not tokens, but still open:

- **Inquiries** go to a Google Form, opened in a new tab from the hero's "Request a sample" button and the two Contact buttons. All three use the plain form link for now. When there is a pre-filled link with the inquiry type set to "샘플 요청" (form editor › ⋮ › Get pre-filled link), put it on the two "Request a sample" buttons. The English page uses the same, Korean form until there is an English one.
- **Evidence for the radiation claim.** Infrared-shielding additives are also used in other high-temperature silica insulation, so the Radiation panel calls the feature a "core function", not a differentiator. Comparative data measured under the same conditions (high-temperature conductivity, or a cell-to-cell propagation test such as UL 9540A for ESS or the GB 38031 thermal propagation test for EVs) would let the page say more.
- The two pages are separate files. A change to the copy or markup has to be made in both, and text set by script (the animation stage labels and button labels) is in the `TEXT` table at the top of `assets/js/main.js`.

## Where the page departs from the design, and why

**Copy (revised after the review of the live page)**

- Headings say what each section contains, without trailing periods or two-fragment slogans, and no section has an eyebrow label above its heading.
- The name is written "AeroTherm" everywhere, as in the logo.
- The convection-and-radiation explanation appears once in the hero (short) and once in Technology (in full). The About callout that repeated it is gone, and so are "highly effective", "suppress or stop" and "also called Aerotherm".
- Claims are phrased as design intent ("designed to keep heat from spreading") until there is test data. ESS containers are mentioned as a consequence of stopping propagation between cells, not as a direct effect of the board.
- The Knudsen panel says the effect is the drop in heat conduction through the gas, and states the conditions of the ~70 nm mean free path (room temperature, atmospheric pressure), so it is not read as the pore size.
- The conductivity panel is titled for room temperature, shows the range once, asks for a source and AeroTherm's own value with its test conditions, and notes that thermal-runaway performance is a separate test. The "more than twice styrofoam or glass wool" sentence is removed until it can name the specimens and method.
- Self-describing notes ("conceptual illustration", "placeholder", "not connected", the font licence line) are removed. One tag, "How it works: an illustration, not test data", sits right under the comparison's title.

**Layout and components**

- Technology leads with the radiation panel. Both comparison diagrams (radiation and Knudsen) are two SVG columns with their labels in HTML, so the text stays 13 to 14 px on a phone.
- The comparison's controls sit above the two animations. Below 820 px only one animation shows at a time, with a switch ("No board" / "With AeroTherm") that keeps the same frame.
- About shows three facts (founded, location, applications) instead of an icon row. The R&D lab render is removed until there are real sample or test photos.
- The hero's two buttons sit side by side. The Contact section links to the Google Form instead of an unconnected form, and its place mark is a map pin.
- The header is sticky, and its links collapse into a menu below 1200 px. The two application images sit in a shared 16:9 frame so the cards align; the ESS image is letterboxed, not cropped.

**Propagation animation**

- The canvases show a crop of the 1200 × 675 scene (x 140 to 1020), so the module fills about 80% of the canvas. The no-JavaScript images are cropped the same way.
- On the page it plays at half the GIF's speed (100 ms per frame) and holds the end state for 2 s, so the moment the heat reaches the boards is easy to follow. The GIF's fade to the background between loops read as a blink, so the end state now cross-fades back to the first frame (8.4 s per loop). The comparison's scrubber runs from frame 1 to the end state, frame 60.
- The hero has a pause button, as WCAG 2.2.2 requires for a looping animation.
- Glow and blur radii scale with the canvas, and the ground shadow has a fallback for browsers without canvas filters.
- With reduced motion, the play button and scrubber are replaced by a one-line note, and the canvases show frame 32 (with) and frame 60 (without).

**Landing on #links**

- The page scrolls smoothly, and the web fonts reflow the page after the first jump to a `#section` link, which could leave the heading under the sticky header. Once the fonts and the page have loaded, `main.js` settles on the target again, instantly, unless the visitor has already scrolled.

**Logo**

- `logo.svg`, `logo-stacked.svg` and `favicon.svg` are vector traces of the supplied raster logo; replace them with the original vector artwork when it is available.
- The header uses the mark and wordmark side by side; the footer uses the stacked arrangement; the favicon is the mark alone. The logo's slate and orange differ slightly from the page palette, which is unchanged.

**Korean page**

- KO and EN in the header link the two pages, and both pages declare each other with `hreflang` links.
- Hangul is set in Pretendard (SIL OFL), split by Unicode range so a visitor downloads only the files the page uses. Lines break between words (`word-break: keep-all`).

**Color and contrast (WCAG AA)**

- Secondary text is `#566C7D` and blue text `#2A6FAB`; the brand blue `#438CCB` is kept for graphics only.
- In the SVG diagrams, infrared lines use `#D95F1B` and convection shimmer `#B97509`, to reach 3:1 on the light background. The canvas keeps the exact heat ramp.

**Fonts**

- The variable TTFs are subset to Latin and converted to WOFF2. The licenses ship next to the font files in `assets/fonts/`.
- The two font preloads are added by a short inline script, and only when the page is served over HTTP.

## Checks run

- Both pages in Chromium at 390 and 1440 px: no console errors, no horizontal scrolling, and both HTML files have balanced tags.
- Opening `#technology` lands with the heading below the sticky header (136 px from the top at 390 px, below a 72 px header; 192 px at 1440 px, below a 96 px header).
- The hero animates; the comparison's switch shows one animation at a time below 820 px and changes `aria-pressed`; the scrubber ends at frame 60.
- The English Knudsen labels fit their columns, and the diagram labels render at 13 to 14 px on a 390 px screen.

Not checked: Safari and Firefox (only Chromium was available), and screen readers.
