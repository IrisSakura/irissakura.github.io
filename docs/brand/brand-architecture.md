# IrisSakura Brand Architecture

> Status: Frozen foundation, with website presentation v2 adoption
> Effective date: 2026-09-11
> Scope: `IrisSakura/irissakura.github.io`

## Master brand

`IrisSakura` is the creator identity. It represents the developer, the complete technical practice, the research system, and ownership of every product and public outcome. It is not a fifth product brand.

## Brand layers

```text
IrisSakura
├── Iris Engineering
├── SakuraGameFramework (Sakura Framework in established product contexts)
├── Myosotis (stable internal journal identifiers)
└── Violet Shelf (public presentation over stable Iris Shelf compatibility IDs)
```

- **Iris Engineering** owns engineering workflow, project management, pipeline, automation, reliability, verification, and delivery operations.
- **SakuraGameFramework** owns reusable game framework capabilities, runtime systems, gameplay systems, tooling, extension, composition, and integration.
- **Myosotis** owns research, design and creative-reference presentation. Existing Journal routes, RSS, source addresses and publication boundaries remain stable.
- **Violet Shelf** owns the display presentation for local development and creative tools. Existing Iris Shelf package, profile/data, helper, IPC and migration identifiers remain stable.
- **Consumer Lab** and games retain their independent outcome identities.

## Joint lockup

`IRIS × SAKURA` is reserved for occasions where Engineering and Framework appear together. It is not a product, package name, namespace, API name, project-management tool name, or game title.

## Naming contract

Allowed ownership:

- `Iris *`: Engineering, project management, workflow, automation, reliability, and delivery products.
- `Sakura *`: Framework, runtime, gameplay modules, tooling, extension, and integration products.
- `Myosotis`: research, design and creative reference.
- `Violet Shelf`: local development and creative tools.

Forbidden new names remain `Iris Framework`, `Sakura Engineering`, `Sakura Project Management`, `Iris Gameplay`, `Sakura Workflow`, and `Iris Game`.

## Compatibility names

**Myosotis** is the current public presentation name. **IrisSakura Journal** and **Sakura Design Journal** are **Deprecated** public names; the repository identity `sakura-design-journal`, internal `journal` key, historical URLs, RSS, synchronization and publication identities remain unchanged. **Violet Shelf** is the current public presentation name while `iris-shelf` and other technical identities remain stable.

## Information architecture contract

The primary navigation order is `首页 → 作品 → 项目 → 知识 → 关于与联系`. The four project brands remain peers and share the Projects overview; Myosotis activates Knowledge because it is also the public knowledge entry. Brand moves to the Contact page and grouped footer. `/pages/tools.html` does not imply availability, download, platform support or release state.

`config/site-presentation.json` is the presentation owner for navigation grouping, four-project order, display names, routes, value copy, actions and footer groups. It does not own product versions, support matrices or release facts.

## Truthfulness and change control

Planned is not implemented; implemented is not verified; verified is not mature; internal is not public. Concept boards and personas are visual references, never product facts or functional state. Changes require explicit review of naming, navigation, compatibility routes, public copy, generated metadata and tests.
