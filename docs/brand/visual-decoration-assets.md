# Living Site decorative assets

Added 2026-09-21. Presentation assets only; no project screenshots or product claims change.

## Assets

- `assets/images/decorative/iris-sakura-creator.webp`: 1100 × 917 transparent ACG creator illustration beside the desktop introduction, with a dedicated grid cell beside the avatar on mobile. The original is in `docs/brand/art-source/iris-sakura-creator.png` (not in the Pages artifact).
- `assets/brand/decorative/blossom-sprig.svg`: editable cherry branch for writing, about, Now and subscription surfaces.
- `assets/brand/decorative/creative-orbit.svg`: editable constellation for the home updates section.
- `assets/brand/decorative/petal.svg`: editable petal used by the CSS particle field.

The previous botanical illustration is retained only under `docs/brand/art-source/` and is no longer published or referenced. The current reference is `assets/images/profile/irissakura-avatar.jpg`.

The raster artwork was generated with the built-in ImageGen tool; SVG assets were authored in the repository. WebP export uses `cwebp -q 86 -resize 1100 0`. The public illustration is approximately 212 KiB. Preserve the source and regenerate the WebP when revising the art.

## Character art direction

The accepted direction for future IrisSakura character illustrations is refined ACG chibi art: a silver-haired creator character, soft lavender and iris-purple accents, clean anime linework, restrained cel shading, expressive but calm posing, and transparent backgrounds that integrate naturally with the site. Keep the character charming and compact without turning it into a generic mascot icon. Avoid realistic botanical watercolor, photorealism, heavy 3D rendering, exaggerated anatomy, or compositions that compete with page content.

## Generation prompt

Create a NEW decorative illustration for an ACG / anime game developer personal website named IrisSakura. The attached manga avatar is a STYLE and CHARACTER-MOOD REFERENCE: delicate manga face, straight silver-white fringe and long hair, expressive soft eyes. Do not recreate the avatar crop or pose. Produce a refined contemporary Japanese anime chibi illustration, about 3-head proportions, a silver-haired young adult female creator mascot with lavender eyes and a tiny iris-purple ribbon, fully clothed in an oversized lavender hoodie and dark pleated skirt, seated comfortably sideways at a small floating white desk, happily sketching a game concept in a drawing tablet. A small periwinkle game controller, closed sketchbook and tiny pink cherry-blossom charm on the desk. Clean precise colored anime lineart, crisp cel shading, luminous but restrained lavender/pink/sky accents, subtle screen-tone details, expressive but calm, professional premium doujin illustration quality, charming coherent composition. A few floating tiny pixel stars and one subtle sakura petal provide a loose frame. Isolated asset with a REAL TRANSPARENT BACKGROUND, all character, hair, chair and desk fully within generous transparent margins. Landscape-ish square composition, about 1.2:1, suitable as a large hero illustration beside text. No words, no letters, no logos, no webpage UI, no watermark. Avoid realistic botanical flowers, watercolor, photorealism, 3D rendering, heavily blurred gradients, erotic framing, exaggerated anatomy. The image is decorative mascot artwork, not a real product screenshot.

## Ownership and behavior

- `config/brand.json` registers asset paths; `scripts/lib/visual-decorations.mjs` owns the explicit intro/collection route list and generated markup.
- `components/footer.html` and `style/main.css` own the in-flow footer motion switch; it never floats over content.
- `style/components/visual-decorations.css` owns illustration layout and CSS animation. `src/ambient-motion.ts` controls pause/resume and disposes observers/listeners on navigation.
- Twelve particles on desktop, six on mobile; only transform animates. Offscreen, hidden-tab and reduced-motion states stop animation. No JavaScript means static decoration. The pause choice persists when local storage is available.
- Article bodies, deep technical documentation and the game page receive no added decoration layer. Decorative assets have empty alt text and never intercept input. The site remains readable without them.
