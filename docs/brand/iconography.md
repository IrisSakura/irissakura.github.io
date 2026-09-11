# IrisSakura Iconography

## Two icon systems

GitHub, Email, Menu, Close, External link and Search retain Font Awesome, avoiding duplicate general interaction glyphs. Brand concepts use `assets/brand/icons.svg` with a consistent 24×24 viewBox, rounded line ends, 1.7 stroke and `currentColor` so they inherit the declared Brand Mode semantic color.

IRIS concepts cover Engineering, Workflow, Pipeline, Automation, Reliability, Verification, Project and Delivery; they favor rectangles, arrows, rails, steps and determined nodes. SAKURA covers Framework, Runtime, Gameplay, Module, Tooling, Extension, Composition and Integration; they favor branching, layering, composition and extensible connections. Shared concepts cover Research, Game, Evidence, Experiment, Consumer and Architecture, and express cross-product objects rather than renaming Consumer Lab or games as Iris/Sakura products.

## Myosotis and Violet Shelf

Compact Myosotis and Violet Shelf marks are identity marks, not operational-state icons. They are bounded code-native SVG reconstructions from approved raster boards; they are not original vectors or editable source illustrations. Do not use flower colors to signify status or use personas inside operational interfaces.

## Usage

Use `<svg aria-hidden="true"><use href="../assets/brand/icons.svg#iris-pipeline"></use></svg>` for an icon with adjacent text; otherwise provide the button or link an accessible name. Core concepts must not be temporarily replaced by Font Awesome and then allowed to spread; adding a symbol requires updates to the Brand Contract tests and this document. Social cards use deterministic mode palettes rather than cropped UI art.
