# Creator vignettes V1

Three sibling illustrations for the article index, work index and About page. The existing homepage creator remains the identity and style reference. Each cover uses one static cutout; article bodies, project personas and actual game screenshots retain their own content.

Generated with the built-in `image_gen` tool, with genuine transparent backgrounds. No CLI/API fallback was used. PNG masters live here and are excluded from the public website artifact because `docs/` is not packaged. Browser assets are in `assets/images/decorative/creator-vignettes-v1/`.

Conversion: `cwebp -q 84 -alpha_q 95 -m 6 -metadata none -resize WIDTH 0 SOURCE.png -o OUTPUT.webp`, with widths 320 and 640. Alpha is retained. HTML reserves a square and uses `srcset`/`sizes`; the artwork is decorative and hidden from assistive technology.

Reference: `assets/images/decorative/iris-sakura-creator.webp`.

## Delivery and acceptance

| Scene | Route | 320px WebP | 640px WebP |
| --- | --- | ---: | ---: |
| Reading | `/pages/blog.html` | 29,272 B | 85,684 B |
| Playing | `/pages/portfolio.html` | 31,534 B | 92,614 B |
| Correspondence | `/pages/contact.html` | 27,952 B | 81,488 B |

All masters are 1254 × 1254 RGBA PNGs. Output hashes and conversion parameters are in `manifest.json`. No existing artwork is overwritten.

Local acceptance on October 3, 2026:

- `npm run check`: 217 unit tests and 145-page local-reference verification passed.
- The full browser run completed the project-hero matrix and 24 representative routes at nine widths, including loaded/contained creator art, no text overlap and mobile copy-first order. It then stopped at an old contrast-test selector that no longer reached the Blog description through the new grid wrapper. The selector was corrected without changing the contrast assertion.
- The Contact heading's two-line composition was refined after visual inspection. The final build and 145-page reference check passed, and Contact was rechecked at all nine widths with zero overflow, clipping or illustration/copy overlap.
- Final `npm run test:smoke -- --flows-only` passed navigation, reading, search, fallback recovery, motion/runtime, accessibility and resource budgets. The unchanged route-layout evidence was reused. All eight sampled routes, now including Works, reported CLS 0. Blog and Contact each add one image request; other existing samples retain their prior image bytes and request counts.
- `npm run package:site` passed. The final CSS bundle is 299,492 B, +1,417 B from this round's baseline. No new JavaScript or continuous animation was added.

Desktop and 390px screenshots, logs and scope hashes are in ignored `tests/output/creator-vignettes-review-2026-10-03/`. This is local browser acceptance, not live deployment or a new CPU/FPS benchmark. Prior working-tree changes are preserved; this round is not committed or pushed.

## Correspondence prompt

Use case: identity-preserve. Asset type: transparent website creator-character vignette, correspondence edition.
Edit the supplied creator illustration into a new sibling scene. Keep the exact recognizable character identity, silver-white flowing hair, lavender eyes, small lavender side bow, oversized pale lavender hoodie with dark bow details, dark pleated skirt, white socks and lavender shoes. Preserve its polished delicate anime linework and restrained cel shading. Change pose and props: she sits sideways on a low rounded lavender cushion, both legs together angled to the left, holding a large ivory envelope with a small lavender four-petal seal at chest height, gently offering it toward the viewer with a quiet welcoming smile. Replace original computer, desk and chair entirely. Beside her is one small neat bundle of two letters tied with a pink ribbon, and a tiny folded lavender paper crane. Two tiny four-point sparkles only. Keep the envelope large and readable as a shape at small sizes. Complete hair, hands and feet visible; compact balanced silhouette with breathing room around all edges. Square canvas. Soft lavender, warm ivory and iris-purple, very small pink accents. Genuine transparent alpha background, no scenery, no floor, no checkerboard, no written text, no logos or watermark. Fully clothed, nonsexual, no photorealistic or 3D treatment. Save a new variant; leave the original unchanged.

## Reading prompt

Use case: identity-preserve. Asset type: transparent website creator-character vignette, reading edition.
Edit the supplied creator illustration into a new sibling scene. Keep the exact recognizable character identity, silver-white flowing hair, lavender eyes, small lavender side bow, oversized pale lavender hoodie with dark bow details, dark pleated skirt, white socks and lavender shoes. Preserve its polished delicate anime linework and restrained cel shading. Change the seated pose and props: the creator sits comfortably sideways on two closed lavender books, holding one open ivory notebook on her lap and a slim violet pencil in her right hand, eyes looking gently toward the reader. Replace the original computer, desk and chair completely. One tiny lavender bookmark and two small four-point sparkles only. Hair, books, hands and feet fully visible, compact balanced silhouette, a little breathing room around all edges. Soft lavender, warm ivory and iris-purple, very small pink accents. Approximately square canvas. This is a charming editorial vignette for a writing page, calm and thoughtful, not a large scene. Genuine transparent alpha background; no painted backdrop, no floor, no checkerboard, no typography, no logos or watermark. Fully clothed, nonsexual, no realistic or 3D treatment. Save a new variant; leave the original unchanged.

## Playing prompt

Use case: identity-preserve. Asset type: transparent website creator-character vignette, game-making edition.
Edit the supplied creator illustration into a new sibling scene. Keep the exact recognizable character identity, silver-white flowing hair, lavender eyes, small lavender side bow, oversized pale lavender hoodie with dark bow details, dark pleated skirt, white socks and lavender shoes. Preserve its polished delicate anime linework and restrained cel shading. Change the seated pose and props: she sits cross-legged on a small lavender cushion, holding a compact lavender game controller correctly with both hands, looking up with a small curious happy smile. Replace the computer, desk and chair completely. Beside the cushion are three modest pastel game-prototype blocks (one cube, one small stepped block, one tiny flag on a block), plus a closed ivory sketchbook; no screen. The blocks feel like simple handmade level-design toys, not a real game screenshot. Two tiny four-point stars only. Hair, hands and both shoes fully visible, compact balanced silhouette with clear edges and breathing room. Square canvas. Soft lavender, warm ivory and iris-purple, very small pink accents. Genuine transparent alpha background, no painted backdrop, no floor, no checkerboard, no lettering, no brands or watermark. Fully clothed, nonsexual, no realistic or 3D rendering. Save a new variant; leave the original unchanged.
