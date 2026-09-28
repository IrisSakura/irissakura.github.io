# 公开内容关系

`data/content-relations.json` 保存人工确认的跨类型关系。`scripts/lib/content-relations.mjs` 还从 `config/site-presentation.json` 的项目关系、正式文章的系列/标签，以及 `data/evidence-chains.json` 的已登记引用派生关系。它不做全文相似度或随机推荐。

图节点来自全站公开索引，关系端点必须存在且已公开。构建时检查关系类型、重复边和缺失端点，生成 `data/content-graph.json`。页面底部最多展示 6 个不同 URL 的相关条目；没有关系就不显示。原文章的同系列/标签推荐也不再用“近期文章”补足数量。

维护新关系时先确认两端的稳定 ID、公开 URL 和证据来源。`data/evidence-chains.json` 的原有研究→工程→Framework→游戏语义仍由其自身合同维护；内容图只引用其已公开关系。
