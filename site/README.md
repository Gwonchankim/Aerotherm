# Aerotherm homepage

A static single page: `index.html` plus `assets/` (CSS, JavaScript, fonts, images). No framework and no build step. Open `index.html` from disk or serve the folder from any static server.

```text
site/
├── index.html
├── assets/
│   ├── css/styles.css        design tokens (custom properties) and all styles
│   ├── js/propagation.js     canvas renderer, ported from design-claude/source/render.html
│   ├── js/main.js            animation clocks and controls, menu, form validation
│   ├── fonts/                Manrope and Inter (WOFF2) with their OFL licenses
│   └── img/                  WebP illustrations and the two no-JavaScript stills
└── review/                   screenshots of the built page
```

## Placeholders that need real Aerotherm data

Every unfilled fact is a visible `{{token}}` with a dashed outline. Search `index.html` for `{{` to find them all.

| Token | Where | What is needed |
| --- | --- | --- |
| `{{thermal_conductivity}}` | Technology, "Lower conductivity than still air" panel; Product spec table | Aerotherm's measured thermal conductivity, with unit and test temperature |
| `{{material_grade}}` | Product spec table | Grade or product designation |
| `{{thickness}}` | Product spec table | Board thickness or range |
| `{{dimensions}}` | Product spec table | Board sizes offered |
| `{{density}}` | Product spec table | Density, with unit |
| `{{radiation_blocking}}` | Product spec table, "Radiation-blocking performance" row | The measured figure and its test method |
| `{{temperature_range}}` | Product spec table | Service temperature range |
| `{{thermal_test_methods}}` | R&D and quality, "Thermal evaluation" | Test methods or standards used |
| `{{patents}}` | R&D and quality, "Patents" | Patent or application details, or remove the item |
| `{{certifications}}` | R&D and quality, "Certifications" | Certifications held, or remove the item |
| `{{news_2_title}}`, `{{news_2_summary}}`, `{{news_2_date}}` | News, second card (Research) | A real news item, or remove the card |
| `{{news_3_title}}`, `{{news_3_summary}}`, `{{news_3_date}}` | News, third card (Announcements) | A real news item, or remove the card |
| `{{street_address}}` | Contact | Street address in Pyeongtaek |
| `{{contact_phone}}` | Contact | Phone number |
| `{{contact_email}}` | Contact, and the no-JavaScript note under the form | Email address |

Not tokens, but still open:

- The KO and EN links both point to `#`. A Korean page will also need a Hangul font, because Manrope and Inter have no Korean glyphs.
- The contact form validates in the browser and sends nothing. It needs a backend, and its submit button stays disabled without JavaScript.

## Where the page departs from the design, and why

**Copy**

- Radiation is carried through the hero, About and Technology: a second hero sentence, a "Where Aerotherm differs" block in About, a tag and a fourth-power sentence on the Radiation panel. The concept only mentioned it in passing.
- The radiation diagram captions read "Mainly suppresses convection" and "Suppresses convection and radiation". The concept's "radiation passes" and "blocked" claimed more than the supplied facts.
- "Prismatic cells" is dropped from the Product copy, because the facts do not name a cell format.
- Notes mark the application and lab images as conceptual, and the animation as illustrative with exaggerated board thickness, as `style-notes.md` describes them.
- The conductivity panel states the styrofoam and glass wool comparison, labels 0.011–0.023 W/m·K as typical of the material class, and adds a placeholder for Aerotherm's own value. Its bars are drawn to scale from the two supplied figures instead of the concept's uncalibrated bars.
- The spec table has the new "Radiation-blocking performance" row, and its dashes are placeholder tokens. "Thermal evaluation", patents, certifications, two news cards and the contact details are tokens too.
- "Form design concept" under the button is replaced by the note that the form is not connected. Company is optional.

**Propagation animation**

- The canvases show a crop of the 1200 × 675 scene (x 140 to 1020), so the module fills about 80% of the canvas, close to the concept, not 60%. The no-JavaScript images are cropped the same way.
- The hero has a small pause button. A looping animation needs one under WCAG 2.2.2.
- The fade table is interpolated between whole frames and closes fully at the loop point, so the loop has no visible jump. Whole frames keep the table's values.
- Glow and blur radii scale with the canvas, and the ground shadow has a fallback for browsers without canvas filters.
- With reduced motion, the play button and scrubber are replaced by a one-line note, because the two stills are different frames (32 and 60).
- Without JavaScript the "without" panel needs its own still, so `without-frame-60.png` is copied from `design-claude/review/`. The Product figure is the same renderer held at frame 8.

**Color and contrast (WCAG AA)**

- Secondary text is `#566C7D`, not `#63798A` (4.3:1 on the page background, below AA).
- Blue text is `#2A6FAB`; the brand blue `#438CCB` (3.4:1) is kept for graphics only.
- In the SVG diagrams, infrared lines use `#D95F1B` and convection shimmer `#B97509`, darker than the heat ramp's orange and amber, to reach 3:1 on the light background. The canvas keeps the exact heat ramp.
- Form field borders are darker than the concept's, to reach 3:1.

**Layout and components**

- The header is sticky, and its links collapse into a menu below 1100 px.
- The three principle diagrams are redrawn as inline SVG with their captions in HTML, and the radiation diagram is two SVGs side by side, so labels stay readable at 360 px.
- The loading state is built from HTML elements and CSS keyframes, not SVG. It shows while a canvas waits for its first frame and for one second after a valid form submit.
- The two application images sit in a shared 16:9 frame so the cards align; the ESS image is letterboxed, not cropped.
- The page is longer than the concept (about 8,300 px against 6,820 px on desktop) because of the added copy.

**Fonts**

- The variable TTFs are subset to Latin and converted to WOFF2 (Inter 876 KB to 90 KB, Manrope 165 KB to 30 KB). Both keep their full weight range.
- The two font preloads are added by a short inline script, and only when the page is served over HTTP. Font preloads are CORS requests, which browsers refuse for pages opened from disk.

## Checks run

- Rendered in Chromium at 320 to 1920 px wide with no horizontal scrolling.
- The hero and comparison animate, pause while off screen, and stay on one clock. Play/pause and the scrubber (mouse and keyboard) move both canvases together.
- Live canvas frames match the design's reference stills (`design-claude/review/`) to within GIF palette error.
- With `prefers-reduced-motion`, the canvases show frame 32 (with) and frame 60 (without), and no CSS animation runs.
- Without JavaScript, `hero-frame-32.png` is shown and the navigation links wrap under the header.
- The form reports empty and invalid fields, focuses the first one, and confirms a valid entry without sending anything.

Not checked: Safari and Firefox (only Chromium was available), and screen readers.
