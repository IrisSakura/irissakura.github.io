# 四项目共用维护导航

本页连接网站所展示的四个项目与各自源码仓库的维护入口。展示名、站点 ID、源仓目录名和公开路由是不同层面的身份；站点采用与展示顺序以 [`config/site-presentation.json`](../../config/site-presentation.json) 为准。跨仓路径以下均相对于对应源仓根目录，需在该源码仓库中打开；它们不是本站文件链接。各项目的当前状态由各自 Owner 给出，不从本表复制版本、成熟度或验收结论。

## 项目身份

| 展示名 | 站点 ID | 源仓逻辑名称 | 公开项目路由 | 当前状态查哪里 |
| --- | --- | --- | --- | --- |
| Iris Engineering | `iris-engineering` | `IrisEngineering` | [工程项目页](../../pages/engineering.html) | 源仓 `PLAN-INDEX.md`、对应 `docs/audits/` 证据 |
| SakuraGameFramework | `sakura-framework` | `unitygame-framework` | [框架项目页](../../pages/framework.html) | 源仓 `docs/reference/framework-work-status.generated.md` 与 `PLAN-INDEX.md` |
| Myosotis | `sakura-design-journal` | `sakura-design-journal` | [研究项目页](../../pages/journal.html) | 源仓 `HOME.md`、`governance/status.generated.md` 与对应正文/审计 |
| Violet Shelf | `iris-shelf` | `IrisShelf` | [工具项目页](../../pages/tools.html) | 源仓 `README.md`、`docs/product/tool-garden-registry.v1.json` 和各服务 README/证据 |

站点的 `data/projects.json` 是公开项目事实投影；它不能代替源仓当前实施、Runner 或发布记录。

## 源仓阅读与维护入口

| 项目 | 在对应源仓打开的仓库相对路径 | 用途 |
| --- | --- | --- |
| Iris Engineering | `README.md` → `AGENTS.md` → `PLAN-INDEX.md`；`docs/reference/document-state-governance.md`；`docs/audits/`；`docs/archive/governance/2026-09-09/INDEX.md` | 产品入口、正式工作状态、具名证据及冻结治理历史 |
| SakuraGameFramework | `docs/README.md`；`docs/reference/framework-work-status.generated.md`；`docs/reference/plan-catalog.generated.md`；`docs/reference/framework-inventory.generated.md`；`docs/reference/obsidian-document-catalog.generated.md` | 规则/机器源/执行工具分类，当前工作、计划、包清单与文档图；历史物理处置从 `docs/README.md` 的既有审计链接进入 |
| Myosotis | `HOME.md` → `navigation/README.md`、`notes/README.md` → `notes/外部资料归档/README.md`；`game-designs/README.md`、`game-designs/catalog.v1.json`；`governance/README.md` | 按问题、研究资料、设计范式与维护 Owner 查阅；外部资料的稳定身份与历史迁移从归档 README 继续进入 |
| Violet Shelf | `README.md` → `docs/README.md`；`docs/product/tool-garden-registry.v1.json`；`workbench/README.md`；`semantic/README.md`、`decision/README.md`、`cognitive/README.md` | 产品/工具身份及独立服务入口；运维、具名报告、历史与证据由 `docs/README.md` 接续 |

## 本站维护路径

| 维护对象 | 现有入口 |
| --- | --- |
| Framework 公开快照与采用 | [Framework 同步](framework-sync.md) |
| Iris Engineering 公开投影 | [Iris Engineering 同步](iris-engineering-sync.md) |
| Myosotis 公开研究与文章 | [Journal 同步](journal-sync.md) |
| Violet Shelf 项目状态 | [项目状态同步](project-status-sync.md) |
| 视觉母版与派生文件 | [资产来源与输出](../brand/asset-sources.md) |

此页是仓库维护文档。`scripts/prepare-pages.mjs` 的发布准入清单不含 `README.md` 或 `docs/`；本站公开页面、配置与发布包均由既有 Owner 管理。
