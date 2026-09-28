# 分析服务激活

`src/analytics.ts` 是唯一事件出口。默认 `config/analytics.json` 的 `enabled=false`、`siteDomain=null`：页面不发送分析请求，也不加载第三方分析脚本。适配器使用 [Plausible Events API](https://plausible.io/docs/events-api)，以 `text/plain` 请求发送页面浏览和受控事件；站点标识是公开域名，不是秘密凭据。

站点 Owner 建立 Plausible Site 后，把 `siteDomain` 设置为该站点的公开域名并把 `enabled` 设为 `true`，然后构建与发布。不要把 API Key、账户凭据或写入 Token 放进配置或 `_site/`。如未来更换 Provider，先改适配器和测试，不在页面里散落 SDK 调用。

事件只允许固定名称与 `category`、`queryLength`、`resultCount`、`contentType`、`destination` 等受控字段。页面 URL 只含站内路径，不含 query 和 fragment；Referrer 最多保留来源 origin；不传搜索原文、邮箱、QQ、完整链接、用户标识或浏览器指纹。第三方服务器会接收请求的网络 IP；Plausible 的处理方式见其[官方 Events API 说明](https://plausible.io/docs/events-api)。正式启用前应由 Owner 复核服务设置与适用的隐私要求。
