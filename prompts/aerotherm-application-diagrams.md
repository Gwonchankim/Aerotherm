Draw two technical illustrations for the Applications section of the AeroTherm homepage. They replace the current glossy 3D renders (`design/assets/application-ev.png`, `design/assets/application-ess.png`) and should show one thing clearly: where the AeroTherm board sits, between the cells, inside an EV battery pack and inside an ESS.

**About the product (for accuracy, not for text in the image)**
AeroTherm is a thin nano-silica aerogel board placed between neighboring prismatic battery cells, covering their broad faces, to keep thermal runaway in one cell from spreading to the next.

**Match the existing artwork**
Use `design/assets/hero-frame-32.png` and `design/style-notes.md` as the style reference. The cells and boards must look like the ones in the site's propagation animation.
- Flat technical illustration: crisp navy (#102A43) outlines of one weight, two or three flat tones per surface, no glossy reflections, no photographic texture, no depth of field.
- Background #F6F9FB across the whole image, with no frame or panel behind the drawing.
- Oblique view: the cells' narrow ends face the viewer, and depth recedes up and to the right at about 30°.
- Prismatic cells: tall, flat cans with two terminals on top, in protected blue #438CCB, stacked broad face to broad face.
- AeroTherm boards: one between every pair of neighboring cells, frosted pale blue #CCEAF4 with a crisp #83B9CD edge. Each is about one fifth of a cell's thickness (exaggerated for legibility) and covers the whole broad face; its top edge runs the full depth of the cells.
- Everything that is not a cell or a board (pack tray, module housing, rack, container) is in neutral light grays (#E8EFF4, #D8E2E9, #CAD7E0) with the same navy outline, so the blue cells and the pale boards are the only colored parts.
- Normal operation: no heat, glow, fire, smoke or warning symbols.

**Image 1: `design/assets/application-ev-diagram.png` (EV battery pack)**
A zoom sequence from left to right. On the left, in about a third of the width: an open EV battery pack tray seen from the same oblique angle, with several modules in it, drawn simply. One module is outlined in navy. Thin navy zoom lines lead to the right two thirds, where that module is enlarged and cut away to show 6 to 8 prismatic cells with an AeroTherm board between every pair.

**Image 2: `design/assets/application-ess-diagram.png` (ESS)**
A zoom sequence from left to right in three steps. On the left: an ESS container with one side cut away to show battery racks, drawn simply, with one rack outlined. In the middle: that rack with its stacked modules, with one module outlined. On the right, and largest: that module cut away to show 6 to 8 prismatic cells with an AeroTherm board between every pair. Thin navy zoom lines connect the three steps.

**Both images**
- 2400 × 1350 px PNG (16:9). On the page they appear at about 580 px wide on desktop and 340 px wide on a phone, so keep the shapes large and the boards clearly visible at that size. Leave about 6% empty margin on every side.
- No text, numbers, labelled arrows, logos, brand marks, people or hands. The page explains the picture in HTML, for example "The pale blue panels are AeroTherm boards".
- Keep the two images consistent with each other: the same camera angle, line weight, colors and cell drawing.
- If your tools can draw vector artwork, also deliver each image as an SVG with the same name.

**Deliver** the two images in `design/assets/`, leave every other file as it is, and list the files you made with their pixel sizes.
