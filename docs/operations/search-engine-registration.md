# 搜索引擎站点验证

`config/search-engine-verification.json` 提供 Google 与 Bing 的可选验证值，默认均为 `null`。未配置时生成器不输出空 meta 标签。站点 Owner 可在搜索引擎站长平台建立 URL Prefix 资源，取得对应验证值，写入配置，构建并发布，然后在平台验证并提交 `https://irissakura.github.io/sitemap.xml`。

验证值只用于对应的 HTML meta 标签，不代表账户已验证；仓库构建通过也不等于平台接受。不要猜测或伪造验证值。正式页面的 canonical 与 sitemap 由生成器维护；兼容跳转页保留 noindex 且不进入 sitemap。`robots.txt` 指向 sitemap，不承担内容保密职责。
