# Sakura Framework 公开快照维护

`data/framework.json` 是网站消费的白名单公开快照，不是 Framework 仓库的完整清单，也不是网站侧手工维护的事实源。

`data/framework-adoption.json` 是站点侧的人工策展采用快照，负责公开经人工复核的 Supported 包、最小稳定 Profile 路线与《言铸之剑》的已验证依赖映射。它的 `adoptionReviewHash` 必须与 `data/framework.json` 完全一致；采用相关事实变化但说明尚未复核时，网站构建应失败而不是继续发布旧口径。`sourceCommit` 记录最近一次人工复核所依据的 Framework 提交，可以落后于自动同步的公开快照提交。

`data/framework-quickstart.json` 是站点侧的 15 分钟教程清单。它只保存经编辑复核的路线 ID、步骤、完成标准和故障边界，不复制 Supported 包清单或版本号；生成器通过路线 ID 从 `data/framework-adoption.json` 派生实际包名。Quickstart 同样绑定 `adoptionReviewContract` 与 `adoptionReviewHash`，当稳定路线或 Supported 身份变化时失败关闭，必须先重新核对 Framework 的 15 分钟指南、Supported Profiles 和 stable manifest snippet。

`data/framework-story.json` 是网站拥有的首页叙事合同，与自动快照和采用快照分开维护。它只描述 Positioning、保守的 Cross-Engine Architecture Map、Three Engineering Pillars 与 Reference 入口，并固定绑定已审阅的 Framework immutable commit `9d436c62f5cfbe78c84c9ef44fe8b5f8214d5cd1`。它不得复制包数量、生命周期统计、Supported 包清单或 Framework 的生成时间。

Story 合同中的状态是公开证据边界：Portable .NET Core / Config Core / Parallel 当前为 Portable Preview，Unity route 为 Supported，Godot 仅为 Parallel Preview；Godot Core / Config 为 Deferred，Godot Runtime Host 为 Not delivered。证据仍明确写作 `local-passed / runner-pending`，直到同一提交的 Runner 证据闭合前不得升级口径。

## 权威边界

- Framework 权威仓库负责从自己的生成清单构建公开快照；
- 网站仓库只接收并验证 `data/framework.json`；
- Framework 自动快照负责数量、生命周期、Layer 与模块投影；网站 Story 合同负责首页叙事，两者不可互相代管；
- 公开契约只允许 `schemaVersion`、`sourceCommit`、`generatedAt`、`adoptionReviewContract`、`adoptionReviewHash`、`summary`、`lifecycleCounts`、`layers` 和 `featuredModules`；
- 私有地址、内部路径、Secret、路线图、审计备注和原始清单对象不得进入公开 JSON。

`adoptionReviewHash` 是 Framework 仓库生成的确定性 SHA-256 指纹，只覆盖：

- 所有 `Supported` 包的完整包名与模块 ID；
- 所有 `stable` Profile 的 ID、模块 ID 与排序后的包闭包。

包版本、exact tag、提交 SHA、生成时间、普通计数和展示 metadata 不进入指纹。它们变化时自动同步可以继续；Supported 身份或稳定路线闭包变化时仍必须人工复核。

`adoptionReviewContract` 标识指纹算法和语义版本。网站当前只接受
`supported-stable-v1`；Framework 升级该契约时，必须先更新并推送网站 validator
和 `data/framework-adoption.json`，再提交或推送 Framework 变更。

## 同步方式

Framework 仓库的发布工作流生成快照后，只更新网站仓库中的 `data/framework.json`。若内容无变化，不创建空提交。跨仓库写入使用仅面向网站仓库的独立 Deploy Key，不能复用服务器登录密钥。

网站收到新快照后，`npm run generate` 会用同一 JSON 更新
`pages/framework.html` 的静态回退数字、来源提交和更新时间，并同步
`pages/portfolio.html` 中的生命周期证据摘要；浏览器中的 TypeScript 加载器再验证并渲染完整交互视图。

`npm run generate` 同时读取并校验 `data/framework-story.json`，以生成器拥有的
`framework-story-hero`、`framework-story` 和 `framework-reference` 区块投影到
`pages/framework.html`。修改 Story 的定位、引擎状态、支柱或 Reference 顺序时，
必须同步 `tests/framework-story.test.mjs`；修改自动快照字段时不能顺手改写 Story。

`data/framework-engineering.json` 是 Framework Engineering Hub 的单一内容合同，固定绑定
同一 Framework immutable commit，并只保存 D0–D3 深度模型、三条读者路径、十个领域的
交付状态与真实页面路由。它不替代 `data/framework.json` 的自动快照；D0–D3 和十个领域的
`implemented` 只表示网站内容与路由已经生成，不表示对应 Framework 能力达到 Runner、Release 或 Production。

Hub 由 `components/framework-page-shell.html` 提供结构骨架，`scripts/generate-site.mjs`
读取并生成 `pages/framework-engineering.html`。三个合同模型（Engineering、95 项需求覆盖、
Evidence Authority）都在生成前校验；其中 Evidence Authority 明确区分 Designed、Implemented、Local、
Runner、Consumer、Release、Production 与 Unknown，不能把相邻等级互相升级。修改 Hub 字段、
路由或证据文案时，必须同步对应模型测试与生成页检查。

Architecture、Evidence、Case、Evolution、Knowledge Graph 与 Module Reference 的策展合同及
18 条深页维护方式见 `docs/maintenance/framework-engineering.md`。这些合同可以解释 exact-SHA
结构事实，但不得向 `data/framework.json` 回写手工字段，也不得让网站策展覆盖 Framework Owner。

若生成器报告 `framework adoption review required`，维护者应核对 Supported 包
身份和 stable Profile 闭包；确认采用说明仍成立或完成必要修订后，再同步
`data/framework-adoption.json` 的 `sourceCommit`、`updatedAt`、
`adoptionReviewContract` 与 `adoptionReviewHash`。不得只为通过构建而盲目复制
新 contract/hash。

若生成器报告 Quickstart review contract/hash 过期，或路线 ID、包身份不一致，应在同一次人工复核中更新 `data/framework-quickstart.json`。`#main` 只允许作为 Developer Console 的开发/评估入口；正式项目的版本选择继续由 Framework 仓库中的 stable snippet 负责，网站不自行固定 tag。

## 验证

```bash
npm run check
npm run test:smoke
git diff --check
```

重点确认：

- JSON 只有公开白名单字段；
- Story 合同仍绑定 exact Framework commit，并保留 Unity/Godot 的保守状态；
- 页面先呈现 Positioning、Architecture Map 与三大工程支柱，Module/Layer/Lifecycle 仍可由 Reference 入口访问；
- 页面静态回退与 JSON 摘要一致；
- 生命周期计数和数据来源时间可见；
- JSON 加载失败时静态内容仍可阅读；
- 公开文件不含私有仓库 URL、本机路径或部署 Secret。
- Engineering Hub 的标题、canonical、JSON-LD 与 meta description 来自 `data/framework-engineering.json`；
  Hub、首页和 Portfolio 的入口只指向已生成或已存在的页面；18 条深页都应存在于 sitemap、Social build output 与 Pages artifact。

## 历史交付包

早期 `gitea-patch/` 只用于把生成器与发布工作流交付到 Framework 权威仓库。2026-07-28 的网站快照已经由同步链路更新，因此该临时目录不再由网站主分支长期保存。
