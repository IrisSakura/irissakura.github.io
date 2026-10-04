# Project showcase content

The generator owns all public HTML. `data/project-showcases.json` owns manually reviewed project chapters, the Violet tool directory and problem-based Framework introductions. `scripts/lib/project-showcases.mjs` validates and renders those chapters. Search entries use the same chapters; section navigation remains in `PAGE_INDEXES` in `scripts/generate-site.mjs`.

## Editorial boundaries

- Wisteria is a text-only technical introduction. Do not capture, import or publish application screenshots, recordings, real usage scenes or simulated application views. Its generated main content has no image, video, audio, canvas or embedded frame. Existing brand identities elsewhere are separate from product usage media.
- Framework scenarios resolve against the effective, snapshot-matched adoption review. An entry waiting for a source snapshot must not become publicly available through a new editorial section.
- Source-owned project exports remain intact. In particular, the historical Iris Shelf and Iris Engineering exports are not rewritten as if their owners had produced a new snapshot. Current visitor summaries, keywords and narrative chapters are website-owned editorial content; CLI/MCP research tools are not advertised as desktop GUI features.
- Journal articles and summaries only enter through the public export/import pipeline. Local notebooks and unapproved articles are not copied into the site.
- Public copy explains capabilities, workflows and practical limitations. Source identities and asset provenance belong in this maintenance record, not visitor copy.

## Review on 2026-10-05

Website baseline: `a6aaae5b357d25a23ba42218a053d8071df953ad`.

| Project | Reviewed source | Public content |
| --- | --- | --- |
| SakuraGameFramework | Existing site snapshot and effective adoption review | Six problem-based adoption introductions; no new Supported or Runner claim |
| Wisteria | `bc2984cf757ce110fb50aac884d8aa802e74ee93`, README and docs 56, 58, 60, 65, 66; local cross-engine acceptance notes | State ownership, animation runtime, character/skin handoff, persistence and current limitations; cross-engine comparison is local research, not production replacement |
| Violet Shelf | `14c9733ea4ca28879e6e6856584a10e38d65337e`, application README and tool implementations; Semantic/Decision/Daily Focus reports | Nine tools, explicit-input creative workflow, Workbench and independent CLI/MCP research tools |
| Iris Engineering | `4b604b2893bc57ff09fddde607562649d470ed2c`, build/playtest and Continuity documentation | Build identity through playtest and diagnosis; local recovery tooling with remote/new-machine limits |
| Myosotis | Public export at `33050ea4957558932c45e8bbe6b02df7dce69e5c` | 97 design summaries, 83 audits, six existing blog source records; no additional formal article publication |
| The Weaver | Committed source `4ece05fd220412145a77195f14b8f997765e527e`, README, powers, card rules and asset | Character detail with Compile/Bloom/Handoff/Dual/Adapter rules and current content limits; uncommitted 0.1.2 work excluded |

### Imported character asset

- Source: `编织者 TheWeaver/assets/characters/weaver_character_select.png` at the committed source above.
- Output: `assets/images/the-weaver/character-select.png` (unmodified; 1086 × 1448; 1,959,889 bytes).
- SHA-256: `c15f806d8258d0229af8befc615d826b0fb244b40e6d45b5c043debfd92b481e`.
- Visually inspected before use. This is the character-selection artwork, not a game screenshot or a claim about front-end acceptance.

### Card Studio sample capture

- Output: `assets/images/violet-shelf/card-studio-demo.png` (1440 × 1120, unmodified browser screenshot).
- Captured from the local browser demo using a fresh isolated profile and a newly authored sample card, 花间小憩. No existing personal library, workspace files or native application data were loaded.
- The Card Studio source subtree had no local modifications at capture. The screenshot depicts browser-mode document editing and preview, not native export or Workbench acceptance.
- SHA-256: `ecafe84f0d617403c96db00e0dfa15776544059a2ff5d197d0b48202c150fb79`.

## Acceptance

Run `npm run check`, `npm run test:smoke`, `npm run package:site`, and `npm run journal:check -- --input <public-export-directory>`. Review the new detail route, mobile chapter layout, Wisteria text-only contract, search results and cross-project links in a browser. No source-product runtime acceptance or deployment is implied by website checks.

### Observed results

On 2026-10-05 the JSON and evidence-authority checks, generation, TypeScript/CSS build, brand contract, unit cases (including the focused rerun of updated content assertions), all 152 HTML/local-reference checks, public-artifact check and Journal import comparison passed. The full browser smoke passed navigation/history, search, related content, accessibility, performance and mobile routes. The six updated pages were visually reviewed at 1440 px and 390 px; the shared responsive suite also includes the new character detail and enforces Wisteria text-only content.

The final search-only correction applied Wisteria keywords to its presentation-backed search record. Chapter/search regression cases passed afterward; generated HTML, assets and runtime bytes were unchanged from the browser-tested set. The final public package and whitespace checks passed. Source-product runtime validation and public deployment were outside this website change.
