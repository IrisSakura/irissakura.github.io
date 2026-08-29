# IrisSakura Brand Architecture

> Status: Frozen for Phase 0
> Effective date: 2026-08-30
> Scope: `IrisSakura/irissakura.github.io`

## Master brand

`IrisSakura` is the only master brand. It represents the developer, the complete technical practice, the research system, and ownership of every product and public outcome.

## Brand layers

```text
IrisSakura
├── Capability
│   ├── Iris Engineering
│   ├── Sakura Framework
│   └── IrisSakura Journal
└── Outcome
    ├── Consumer Lab
    └── Games
```

- **Iris Engineering** owns engineering workflow, project management, pipeline, automation, reliability, verification, and delivery operations.
- **Sakura Framework** owns reusable game framework capabilities, runtime systems, gameplay systems, tooling, extension, composition, and integration.
- **IrisSakura Journal** owns public research, reasoning, engine study, architecture notes, game-design research, and engineering analysis.
- **Consumer Lab** is an independent validation layer. It is not part of the IRIS or SAKURA naming families.
- **Games** are independently named outcomes. The technical brand supports a game and does not replace its own identity.

## Joint lockup

`IRIS × SAKURA` is the joint ecosystem lockup for occasions where Engineering and Framework appear together. It is not a third product and must not become a package name, namespace, API name, project-management tool name, or game title.

## Naming contract

Allowed ownership:

- `Iris *`: Engineering, project management, workflow, automation, reliability, and delivery products.
- `Sakura *`: Framework, runtime, gameplay modules, tooling, extension, and integration products.
- `IrisSakura *`: master-brand identity and cross-capability properties such as IrisSakura Journal.

Forbidden new names:

- `Iris Framework`
- `Sakura Engineering`
- `Sakura Project Management`
- `Iris Gameplay`
- `Sakura Workflow`
- `Iris Game`

`Sakura Design Journal` is **Deprecated** as a public product name. New public copy uses `IrisSakura Journal`. The internal project ID `sakura-design-journal` and historical URLs may remain stable for synchronization and compatibility; internal identifiers do not define public brand ownership.

## Information architecture contract

The primary navigation order is:

```text
首页 → 作品 → Engineering → Framework → Journal → Brand → 联系
```

Engineering and Framework are peers. Brand is independent from Art / Music. `/pages/brand.html` owns the public brand guidelines; `/pages/art-music.html` is only a compatibility redirect until a future Creative section has real content.

## Truthfulness contract

Public brand language must preserve these distinctions:

- Planned is not implemented.
- Implemented is not verified.
- Verified is not mature.
- Prototype is not release.
- Internal is not public.
- Research is not production.

Evidence supports the work; the work does not exist merely to display evidence.

## Change control

Any new product or top-level page must answer:

1. Who owns it? (`IrisSakura`)
2. Which capability family does it belong to? (`IRIS`, `SAKURA`, or research)
3. What kind of outcome is it? (product, lab, game, or content)
4. Which page experience will represent it?

Changes to this frozen architecture require an explicit review of naming, navigation, compatibility routes, public copy, generated metadata, and tests.
