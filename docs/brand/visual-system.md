# IrisSakura Visual System

> Current baseline: Six Flower Personas V2 and six page compositions

## Ownership chain

```text
Primitive → Semantic → Component → Page Brand Mode
```

`style/tokens/primitive.css` owns raw Iris, Sakura, shared, neutral, support and state values. `config/personas-v2.json` owns the six approved character palettes, generated into `style/tokens/personas-v2.css`. `style/tokens/semantic.css` assigns UI meaning such as background, text, border, action and status. Shared components consume those semantic values, while `style/tokens/modes.css` tunes declared page emphasis. `style/tokens/compatibility.css` maps existing brand and UI tokens; `style/iris-sakura.css` preserves the old stylesheet URL.

Components and page styles must not introduce new master-brand colors. A raw color starts in Primitive, receives a Semantic role, and is consumed through a component or mode token. Brand colors must not replace success, warning, failure, verification or product-state semantics.

## Page modes

`config/brand.json.pageModes` is the generated-page registry. `master`, `iris`, `sakura`, `journal`, `violet`, `freesia`, `wisteria` and `game` are closed modes. `journal` remains the stable internal mode while presenting Myosotis; `violet` presents Violet Shelf on the local Tools page. Every page retains `data-brand="iris-sakura"`; a mode is a page responsibility, not an additional technical identity or visitor theme switch.

`config/page-families.json` declares page composition independently of the palette. The six project entries retain distinct structures: Iris workflow axis, Sakura module branches, Myosotis archive index, Violet workbench, Freesia discovery route and Wisteria layered world. `style/site.css` owns the layer order and imports; `style/pages/grammar.css` owns their composition and responsive behavior, while `style/personas/identity.css` owns character decoration.

## Project hero ownership

The six project routes resolve their identities from `config/site-presentation.json`, `config/brand.json` and `config/personas-v2.json`. Engineering, Framework, Journal and Tools use `data-brand-project-hero`; Mods and Wisteria retain dedicated hero markup. Each displays one complete optimized character from `assets/personas/v2/`. `data/site.json.pageCovers` continues to own general category and work imagery. Source dimensions, conversion parameters and hashes are recorded in `assets/personas/v2/manifest.json`.

Character images use `object-fit: contain`. Decorative frames and shadows must not crop or cover them. The Wisteria character stage fits within the world scene; on small screens Iris uses a full-width character above the workflow links. At desktop widths Sakura places its character beside the introduction and module branches. Workflow and archive decorations remain local to their compositions so reading surfaces stay quiet.

## Accessibility and maintenance

- Unknown or missing modes fail generation.
- Generated HTML must load Primitive, Semantic, Mode and shared brand styles.
- Reduced motion is independent of brand mode.
- Refresh generated HTML with `npm run generate`; never repair its shell, metadata, attributes or stylesheet links by hand.
- Imported boards/personas are storytelling references; their counts, platform labels, decorative UI and copy are not live product facts.
