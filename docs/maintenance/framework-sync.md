# Sakura Framework 公开快照维护

`data/framework.json` 是网站消费的白名单公开快照，不是 Framework 仓库的完整清单，也不是网站侧手工维护的事实源。

`data/framework-adoption.json` 是站点侧的人工策展采用快照，负责公开经人工复核的 Supported 包、最小稳定 Profile 路线与《言铸之剑》的已验证依赖映射。它的 `adoptionReviewHash` 必须与 `data/framework.json` 完全一致；采用相关事实变化但说明尚未复核时，网站构建应失败而不是继续发布旧口径。`sourceCommit` 记录最近一次人工复核所依据的 Framework 提交，可以落后于自动同步的公开快照提交。

## 权威边界

- Framework 权威仓库负责从自己的生成清单构建公开快照；
- 网站仓库只接收并验证 `data/framework.json`；
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

若生成器报告 `framework adoption review required`，维护者应核对 Supported 包
身份和 stable Profile 闭包；确认采用说明仍成立或完成必要修订后，再同步
`data/framework-adoption.json` 的 `sourceCommit`、`updatedAt`、
`adoptionReviewContract` 与 `adoptionReviewHash`。不得只为通过构建而盲目复制
新 contract/hash。

## 验证

```bash
npm run check
npm run test:smoke
git diff --check
```

重点确认：

- JSON 只有公开白名单字段；
- 页面静态回退与 JSON 摘要一致；
- 生命周期计数和数据来源时间可见；
- JSON 加载失败时静态内容仍可阅读；
- 公开文件不含私有仓库 URL、本机路径或部署 Secret。

## 历史交付包

早期 `gitea-patch/` 只用于把生成器与发布工作流交付到 Framework 权威仓库。2026-07-28 的网站快照已经由同步链路更新，因此该临时目录不再由网站主分支长期保存。
