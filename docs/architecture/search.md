# 全站 Discovery

`scripts/lib/content-search-model.mjs` 与 `data/search-index.json` 保留 Myosotis/Journal 的原有搜索合同。全站搜索由 `scripts/lib/site-search-index.mjs` 在构建时生成 `data/site-search-index.json`，复用已出版文章和公开研究条目，再加入正式页面、公开项目及 Framework 模块。两份索引的职责不同：Journal 的筛选与结果数量保持稳定；全站索引供每页导航栏的 Search / Cmd/Ctrl+K 使用。

全站条目只投影 `id`、类型、标题、摘要、语义 URL、公开关键词、标签与系列。私有路径、来源提交、出版前条目和 owner-only 字段不能进入索引。相同事实输入产生固定顺序；排名按标题精确匹配、前缀、关键词、标签、系列、摘要依次降权，再按 ID 消除平分。

全站索引使用紧凑 JSON 输出，未关联项目的条目省略 `projectId`，有关联的条目保留项目 ID。读取端支持省略值及历史 `null` 值。标题、摘要、URL、关键词、标签和系列参与原有检索与排序。

站点构建把同一索引拆成 `dist/site-search/` 下的清单和内容哈希命名的分片。`searchIndexBytes` 约束每个实际加载文件的 UTF-8 字节数，新增文档达到分片上限时自动开启下一片。测试逐字段回读全部分片，并校验文件预算。`data/site-search-index.json` 继续供构建模型和旧页面使用。

`src/search.ts` 在打开对话框时加载带项目推荐的清单，有关键词时并行加载分片。首次全文查询的累计字节随语料增长，浏览器性能报告单独记录累计量。全文排序在分片齐全后运行，后续查询复用已加载的数据。缺少清单时兼容旧 JSON。下载中断时保留主导航、页面内容和 Journal 入口，重新打开搜索可重试。无 JavaScript 时静态页面、文章及项目链接仍可访问。

2026-11-16 的 Journal 同步 #297 因完整索引达到 208,554 B 而在站点检查退出。当时的 204,800 B 上限约束随 Journal 一起增长的整个语料。复查时用失败提交 `ed0a417d` 重放正式导入，并用八倍语料确认自动分片和原始索引的一致性。分片位于站点构建目录，由 Pages 打包同步收录。Journal 同步仍只提交原有来源与生成文件。[同步失败日志](https://git.irissakura.com/IrisSakura/Myosotis/actions/runs/1775/jobs/3062)
