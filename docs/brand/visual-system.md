# IrisSakura Visual System

> Status: Phase 2 foundation
> Effective date: 2026-08-30
> Scope: public site CSS, page generation, and accessibility contracts

## Ownership chain

The visual system follows one direction:

```text
Primitive → Semantic → Component → Page Brand Mode
```

- `style/tokens/primitive.css` owns raw Iris, Sakura, shared, neutral, support, and state values.
- `style/tokens/semantic.css` assigns UI meaning such as background, text, border, action, and status.
- `style/main.css` owns shared component behavior and component tokens.
- `style/tokens/modes.css` tunes page emphasis for a declared responsibility.
- `style/iris-sakura.css` remains the single public-brand palette compatibility layer.

Components and page styles must not introduce new master-brand colors. A new raw color starts in Primitive, receives a Semantic role, and is then consumed through a component or mode token.

## Page modes

`config/brand.json.pageModes` is the mode registry. `scripts/generate-site.mjs` validates the closed allowlist and writes `data-brand-mode` to every generated HTML root.

| Mode | Public responsibility | Representative routes |
|---|---|---|
| `master` | IrisSakura identity and shared outcomes | Home, Works, Brand, Contact |
| `iris` | engineering and delivery control | Engineering |
| `sakura` | reusable framework capability | Framework, Quickstart |
| `journal` | research and knowledge flow | Journal, Blog, all research/article details |
| `game` | game-owned presentation with restrained attribution | Game |

Brand Mode does not create additional brands and does not restore visitor theme switching. Every page continues to use `data-brand="iris-sakura"`.

## Current migration boundary

Phase 2 establishes the token chain and moves the representative Home, Engineering, Framework, Journal, and Game Hero surfaces onto mode tokens. Existing page CSS remains valid and will migrate incrementally.

This phase does not claim the complete Phase 3 sub-brand experience. Geometry, pattern, icon, density, and motion differentiation still require dedicated visual review. Official Wordmark, product lockups, icon assets, and social templates belong to the later visual-identity phase.

## Accessibility and maintenance

- Token refactors must preserve WCAG AA contrast checks; tests resolve Semantic variables to their Primitive hex values rather than bypassing the threshold.
- Unknown or missing page modes fail generation.
- All generated pages must load Primitive, Semantic, Mode, and single-brand palette styles.
- Reduced-motion behavior remains shared and independent of Brand Mode.
- Generated HTML must be refreshed through `npm run generate`; do not repair mode attributes or stylesheet links by hand.
