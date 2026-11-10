# Aerotherm — design handoff

Design only. Rebuild the interface from the two concept PNGs; no HTML or CSS is included. The visuals explain a mechanism and do not represent measured validation, a certified product specification, or an existing laboratory facility.

## Color and material

| Role | Hex |
| --- | --- |
| Page and animation background | `#F6F9FB` |
| White panels | `#FFFFFF` |
| Primary navy | `#102A43` |
| Graphite body text | `#405363` |
| Secondary text | `#63798A` |
| Rules and borders | `#CFDDE6` |
| Protected cells / interaction blue | `#438CCB` |
| Frosted aerogel | `#CCEAF4` |
| Crisp aerogel edge | `#83B9CD` |
| Heat ramp | `#F3B044` → `#EE742C` → `#B82C25` |
| Final ember | `#71352E` |

Use soft laboratory lighting, metallic microtexture, fine rules and restrained grounding shadows. Aerogel is pale blue and translucent, with a crisp boundary. Infrared radiation is horizontal orange-red wavy rays; convection is rising shimmer. No flames or explosions. Keep the page background behind all animations. GIF palettes reserve the exact brand colors, including the background.

## Typography and layout

- Google Fonts: [Manrope](https://fonts.google.com/specimen/Manrope) for headings and the wordmark; [Inter](https://fonts.google.com/specimen/Inter) for UI and body copy. Variable TTFs and their OFL licenses are included in `fonts/`.
- Desktop: 1440 × 6820 px, centered 1248 px content, 96 px outer margins, 32 px primary column gutter, 96 px header. Headings approximately 36–48 px, body 16–23 px, UI 13–16 px.
- Mobile: 390 × 9852 px, 24 px margins, one column, 72 px header with collapsed menu. Headings 23–35 px, body 15–18 px. Preserve content order and stack all comparisons.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 and 128 px. Controls 52–56 px tall; quiet 5–8 px radii.
- Icons: 192 px square GIF masters, 4.5 px rounded monoline strokes. Display at 64 px for a 1.5 px line weight; scale all six equally. Navy geometry with limited blue or warm motion accents.
- Product table values remain `—`. The conductivity range belongs to the nano-silica material class in Technology, not a verified Aerotherm product specification. The bar comparison is qualitative and uncalibrated.
- Only the supplied technology quantities are shown: `~70 nm` and `0.011–0.023 W/m·K`. The required founding and copyright dates are also retained. News cards beyond the founding milestone are explicit content placeholders. Patents and certifications have no credential marks or claims.

## Cell geometry and shared animation rules

Both propagation GIFs use the same fixed orthographic camera, approximately 25° off the narrow-end view and slightly above the module. Five tall, flat prismatic metal cans sit broad-face to broad-face, each with two top terminals. Relative physical dimensions: cell thickness 70, broad-face width 250, height 320; board thickness 7. These are illustration construction units, not product dimensions or specs. The four boards cover the broad faces. Fine cutaway outlines expose their area; the empty version preserves the same gaps and all cell positions.

Heat always begins in the middle cell. Geometry, terminal positions, camera, background and lighting remain fixed. Each propagation GIF has exactly 64 encoded frames at 1200 × 675 px. Frames 1–63 display for 50 ms; frame 64 displays for 1550 ms, comprising its normal 50 ms plus a 1500 ms hold. Motion is 3.2 s; the full looping cycle is 4.7 s. Both use the same global color table, with no local frame palettes. Heating stages use cubic smoothstep, `3t² − 2t³`.

`assets/hero-frame-32.png` is decoded directly from frame 32 of `propagation-with.gif`. Both homepage heroes use that same image, cropped and scaled to the module, without changing its heat state. The Technology comparison uses the matched final states.

## GIF keyframes, timing and easing

| File | Keyframes and motion | Timing / easing |
| --- | --- | --- |
| `propagation-without.gif` | 1–8 cool; 9–16 center heats; 17–32 center vents, rays and shimmer spread toward adjacent cells; 33–48 adjacent cells become hot and pass heat outward; 49–64 outer cells become hot, ending with the whole module hot. | 64 frames; 50 ms, last 1550 ms; stage smoothstep; continuous low-amplitude ray and shimmer phase. |
| `propagation-with.gif` | 1–8 cool with boards; 9–16 same center heating; 17–32 rays stop at the adjacent board boundaries and only the source-facing edges warm; 33–48 barriers hold; 49–64 center fades directly from hot red to dark ember. The four neighboring cans remain blue. | Same frame count, global palette, timing and camera as the unprotected sequence. Source-facing edge glow eases in; final ember fade uses smoothstep. |
| `principle-knudsen.gif` | Molecules travel along closed triangular chord paths inside small pores, changing direction at walls. Pores stay fixed. The dashed mean-free-path reference is longer than a pore and labeled `~70 nm`. | 960 × 540; 48 frames × 50 ms = 2.4 s. Periodic linear travel between wall collisions; seamless cycle, no end hold. |
| `principle-solid.gif` | Warm pulses follow narrow silica branches. Pulse intensity decreases along the network, leaving the far paths cool. | 960 × 540; 48 × 50 ms = 2.4 s. Linear travel, sine envelope at edge endpoints, spatial attenuation; seamless cycle. |
| `principle-radiation.gif` | Left: aerogel stops rising shimmer while IR waves continue. Right: fixed opacifier particles scatter and reflect IR waves upstream; no outgoing rays or shimmer on the protected side. | 1200 × 540; 48 × 50 ms = 2.4 s. Periodic sine-wave phase; fixed geometry; seamless cycle. |
| `icons/rnd.gif` | Flask geometry stays fixed; cool molecules gently oscillate. | 192 × 192; 40 × 60 ms = 2.4 s. Sine motion; seamless. |
| `icons/nanopore.gif` | Fixed pore outlines with small blue molecule motion. | 192 × 192; 40 × 60 ms = 2.4 s. Periodic sine motion; seamless. |
| `icons/radiation.gif` | Waves arrive at a fixed barrier and turn back. | 192 × 192; 40 × 60 ms = 2.4 s. Periodic wave phase; seamless. |
| `icons/barrier.gif` | Fixed adjacent cell outlines; a warm pulse stays on the source side of the barrier. | 192 × 192; 40 × 60 ms = 2.4 s. Sine pulse travel; seamless. |
| `icons/ev.gif` | Fixed EV outline and pack; a blue accent oscillates inside the pack. | 192 × 192; 40 × 60 ms = 2.4 s. Sine motion; seamless. |
| `icons/ess.gif` | Fixed container; a blue indicator gently changes intensity. | 192 × 192; 40 × 60 ms = 2.4 s. Sine opacity; seamless. |
| `loading.gif` | Temperature bar rises during the first 42% of the cycle, holds at the barrier until 73%, then cools back for the loop. The barrier stays fixed. | 480 × 160; 48 × 50 ms = 2.4 s. Smoothstep rise and reset, constant hold. |

For reduced motion, show the supplied hero frame for the protected state and a static final frame for the unprotected state. GIF playback must start together for synchronized comparison; production implementation should use one shared playback clock or matched video assets if exact synchronization is required.

## Production method and source artwork

Built-in `image_gen` produced the initial visual direction and the EV, ESS and conceptual lab illustrations. The available tool exposed no model selector, so **GPT Image 2.6 could not be specifically selected or verified**. No CLI/API fallback was used. The exact prompts are in `generation-prompts.json`.

The final desktop/mobile canvases and the precise scientific animation sequences were assembled as deterministic raster artwork, using the generated illustrations as page assets. This keeps text legible and makes the frame count, geometry, timing, hero reference and palette reproducible. No HTML or CSS was authored.

`assets/board-material.png` is an additional isolated material illustration. Application and lab assets are conceptual illustrations, not documentary images of an Aerotherm product, installation, facility or test result.
