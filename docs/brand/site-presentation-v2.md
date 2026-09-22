# Website Presentation v2

> 2026-09-22 更新：当前人物视觉基线为 Six Flower Personas V2。首页、项目总览与品牌页展示六个花卉项目，新增 Freesia Mods 与 Wisteria 入口；四个技术项目的稳定 ID 和事实来源保持原契约。当前导航与页面顺序以 `config/site-presentation.json` 为准，人物、配色与主视觉以 `config/personas-v2.json` 为准。以下早期采用记录保留历史背景；最新实施见 [Persona V2 迁移映射](personas-v2/PERSONA_V2_MIGRATION_MAP.md)。

> Status: implemented locally, pending commit and publication authorization
> Adopted: 2026-09-11

This record captures the repository-facing decisions adopted from the approved Website Presentation Revision v2 document. It does not replace project-owned fact exports or grant publishing authority.

## Visitor architecture

The primary navigation is `首页 → 作品 → 项目 → 知识 → 关于与联系`. Stable URLs remain in place. Brand is available from About and Contact plus the grouped footer; Violet Shelf remains a project page rather than a sixth primary route.

The homepage order is personal introduction, representative work, four projects, selected knowledge and contact. The Projects overview and homepage resolve the same four IDs, names, order, routes and concise value copy from `config/site-presentation.json`.

## Four project pages

- Iris Engineering: `pages/engineering.html`
- SakuraGameFramework: `pages/framework.html`
- Myosotis: `pages/journal.html`
- Violet Shelf: `pages/tools.html`

Each page presents project identity and value before deeper status or evidence. Engineering, Framework and Violet use `首页 / 项目 / 当前项目`; Myosotis uses `首页 / 知识` and separately links back to all projects.

The project hero is generator-owned. Its presentation mapping lives in `config/site-presentation.json`, its asset path lives in `config/brand.json`, and its source/output traceability lives in `assets/images/brand/site-v2/manifest.json`.

## Fact boundary

`data/projects.json` and project-specific public snapshots remain the product-fact sources. Presentation configuration does not invent versions, platforms or release status. The 2026-08-30 source-pushed Iris Shelf record remains untouched and is labeled as a historical source snapshot on the portfolio; Violet Shelf's current local candidate description remains on its project page without claiming public download, signing or release.

## Validation boundary

Local generation, contracts, links, accessibility semantics, responsive overflow, browser behavior and packaging are validation targets for this implementation. Commit, push, GitHub Pages publication and post-publication verification remain separately authorized operations.
