# IrisSakura Visual System

> Status: Phase 2 foundation with website presentation v2 adoption

## Ownership chain

```text
Primitive → Semantic → Component → Page Brand Mode
```

`style/tokens/primitive.css` owns raw Iris, Sakura, shared, neutral, support and state values. `style/tokens/semantic.css` assigns UI meaning such as background, text, border, action and status. Shared components consume those semantic values, while `style/tokens/modes.css` tunes declared page emphasis. `style/iris-sakura.css` remains the single public-brand palette compatibility layer.

Components and page styles must not introduce new master-brand colors. A raw color starts in Primitive, receives a Semantic role, and is consumed through a component or mode token. Brand colors must not replace success, warning, failure, verification or product-state semantics.

## Page modes

`config/brand.json.pageModes` is the generated-page registry. `master`, `iris`, `sakura`, `journal`, `violet` and `game` are closed modes. `journal` remains the stable internal mode while presenting Myosotis; `violet` presents Violet Shelf on the local Tools page. Every page retains `data-brand="iris-sakura"`; a mode is a page responsibility, not an additional technical identity or visitor theme switch.

Phase 2 established the token chain and moved representative Home, Engineering, Framework, Journal and Game surfaces onto mode tokens. Website presentation v2 keeps the closed modes, moves Myosotis to a quiet lake-blue editorial palette, and gives all four projects one shared hero composition with distinct project art. This does not claim a complete Phase 3 sub-brand experience; existing deep-page CSS remains valid and migrates incrementally.

## Project hero ownership

The four project routes resolve their hero from `config/site-presentation.json` and `config/brand.json`. The generator installs exactly one `data-brand-project-hero` with the matching optimized portrait from `assets/images/brand/site-v2/`. `data/site.json.pageCovers` continues to own general category and work imagery, but must not also own those four project heroes. Source provenance, dimensions, conversion parameters and hashes are recorded in `assets/images/brand/site-v2/manifest.json`.

## Accessibility and maintenance

- Unknown or missing modes fail generation.
- Generated HTML must load Primitive, Semantic, Mode and shared brand styles.
- Reduced motion is independent of brand mode.
- Refresh generated HTML with `npm run generate`; never repair its shell, metadata, attributes or stylesheet links by hand.
- Imported boards/personas are storytelling references; their counts, platform labels, decorative UI and copy are not live product facts.
