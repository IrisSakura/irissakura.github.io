# 全站 Discovery

`scripts/lib/content-search-model.mjs` 与 `data/search-index.json` 保留 Myosotis/Journal 的原有搜索合同。全站搜索由 `scripts/lib/site-search-index.mjs` 在构建时生成 `data/site-search-index.json`，复用已出版文章和公开研究条目，再加入正式页面、公开项目及 Framework 模块。两份索引的职责不同：Journal 的筛选与结果数量保持稳定；全站索引供每页导航栏的 Search / Cmd/Ctrl+K 使用。

全站条目只投影 `id`、类型、标题、摘要、语义 URL、公开关键词、标签与系列。私有路径、来源提交、出版前条目和 owner-only 字段不能进入索引。相同事实输入产生固定顺序；排名按标题精确匹配、前缀、关键词、标签、系列、摘要依次降权，再按 ID 消除平分。

`src/search.ts` 在打开对话框时加载索引。网络失败时保留主导航、页面内容和 Journal 入口。无 JavaScript 时全站搜索不可用，静态页面、文章及项目链接仍可访问。搜索结果使用现有 URL，没有客户端路由。
