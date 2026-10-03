# Six flower-persona chibi scenes V1

Six companion illustrations for the dedicated project pages. These are derivative Q-version scenes of the approved V2 personas, rendered in the same delicate anime/chibi style as the creator vignettes. Each retains its own hair, flower, costume, palette and characteristic props.

| Persona | Scene | Placement |
| --- | --- | --- |
| Iris | Reviewing a blueprint | Engineering introduction |
| Sakura | Assembling flower-marked blocks | Framework positioning |
| Myosotis | Reading an archive book | Selected research notes heading, after search |
| Violet | Arranging illustrated cards | Tools introduction |
| Freesia | Adapting a game token | Mod creation principles |
| Wisteria | Lantern and growing sprig | Living-world story |

The original hero portraits remain the lead illustrations. Each project has one smaller chibi below its hero, in a separate grid area beside existing copy. The compact Myosotis and Freesia scenes share the heading row on phones; longer introductions stack their art after the text. No characters are added to article bodies or technical subpages.

## Assets and prompts

- Mode: built-in `image_gen`; no CLI/API fallback.
- Identity inputs: `assets/personas/v2/<persona>/web/character-720.webp`.
- Rendering/proportion reference: `docs/brand/creator-vignettes-v1/reading.png`.
- Exact prompts: [`prompts.json`](prompts.json).
- PNG masters: `<persona>.png` in this directory; `docs/` is excluded from the public artifact.
- Web outputs: `assets/personas/chibi-v1/<persona>-320.webp` and `<persona>-640.webp`.
- Conversion: `cwebp -q 84 -alpha_q 95 -m 6 -metadata none -resize WIDTH 0 SOURCE.png -o OUTPUT.webp`.
- Dimensions, alpha flags, byte sizes and hashes: `manifest.json`.

The generated markup reserves a square, uses responsive sources and lazy loading, and hides decorative artwork/captions from assistive technology. All new artwork and its CSS framing are static.

Owners: `scripts/lib/visual-decorations.mjs`, the corresponding templates in `scripts/generate-site.mjs`, and `style/pages/notebook.css`. Generated HTML must be refreshed through the generator.

## Final assets

| Persona | PNG master | WebP 640px | 320px bytes | 640px bytes |
| --- | --- | --- | ---: | ---: |
| Iris | [iris.png](iris.png) | [iris-640.webp](../../../assets/personas/chibi-v1/iris-640.webp) | 36,972 | 116,472 |
| Sakura | [sakura.png](sakura.png) | [sakura-640.webp](../../../assets/personas/chibi-v1/sakura-640.webp) | 38,584 | 116,958 |
| Myosotis | [myosotis.png](myosotis.png) | [myosotis-640.webp](../../../assets/personas/chibi-v1/myosotis-640.webp) | 39,750 | 122,608 |
| Violet | [violet.png](violet.png) | [violet-640.webp](../../../assets/personas/chibi-v1/violet-640.webp) | 33,434 | 101,680 |
| Freesia | [freesia.png](freesia.png) | [freesia-640.webp](../../../assets/personas/chibi-v1/freesia-640.webp) | 41,906 | 130,556 |
| Wisteria | [wisteria.png](wisteria.png) | [wisteria-640.webp](../../../assets/personas/chibi-v1/wisteria-640.webp) | 38,104 | 121,002 |

All six masters are 1254 × 1254 RGBA PNGs; WebP alpha is retained. No existing V2 master or derivative was changed.

## Local acceptance — October 3, 2026

- `npm run check` passed 217 unit tests and 145-page local-reference verification.
- The full browser run completed the project-hero matrix, 24 representative routes at nine widths, reading, contrast, navigation, search, fallback, subscription and motion/runtime flows. The expanded accessibility routes then exposed the existing Freesia principle numbers' insufficient contrast (2.72:1). They now use the persona's deep blue.
- Mobile inspection refined caption wrapping into whole English names and Chinese phrases. The final six project pages passed 60 scoped layout checks at ten widths from 360 to 2048px, with no page overflow, image clipping, text overlap or caption overflow. The final eight affected unit tests and 145-page reference check passed.
- The first productization rerun passed accessibility and then found Freesia's pattern request resolving under `/dist/assets/`. Its generated CSS-variable URL now starts from the site root. Final desktop inspection confirmed HTTP 200 for the pattern and no failed local responses across the six pages.
- Final `npm run test:smoke -- --productization-only` passed the affected accessibility and resource-budget checks. All 12 sampled routes reported CLS 0. Framework and Journal each add one small image request (38,584 B and 39,750 B); the other six previously sampled routes retain their image byte counts and request counts. Four project routes were newly added to the resource/accessibility sample and have no paired prior baseline.
- `npm run package:site` passed after the final URL fix. PNG masters remain outside the public artifact. The final CSS bundle is 301,415 B, +1,923 B over this round's baseline; no new JavaScript or continuous animation is introduced.

Failed intermediate commands are not counted as complete passes. Final screenshots, logs, metrics and scope hashes are in ignored `tests/output/project-chibis-review-2026-10-03/`. This is local browser evidence, not live deployment or a new CPU/FPS benchmark. Existing unrelated and prior visual/performance work is preserved. No commit or push was made in this round.
