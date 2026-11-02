# 自定义域名维护

站点配置目标为 `https://irissakura.com`，`www.irissakura.com` 和旧 `irissakura.github.io` 入口应转向正式 HTTPS 域名。源码中的配置不证明 DNS、证书或线上部署已经完成；上线状态以实际网络与部署证据为准。

## 配置来源

- `data/site.json` 的 `siteUrl` 是页面与订阅 URL 的生成来源；修改后运行现有生成流程。
- JSON-LD 的 Person、WebSite 标识从该配置派生；保持首页与文章作者引用一致。
- `package.json` 的 `homepage` 与正式域名一致；包名和 GitHub 仓库身份保持不变。
- `npm run package:site` 在既有隐私白名单之外校验页面元数据、JSON-LD、Sitemap、RSS 与 robots 的站点 URL；普通历史链接与外部社交链接不因旧域名文本而被禁止。
- 搜索引擎验证与 Sitemap 提交见[搜索引擎登记](search-engine-registration.md)。GitHub 所有权验证与搜索引擎验证分别处理。

## Pages 与 DNS

Pages 的 Source 使用 **GitHub Actions**，保留 `.github/workflows/site-quality-and-pages.yml` 和隔离的 `_site/` 公开包。不使用分支根目录发布；Actions 模式中的 `CNAME` 文件不会替代后台 Custom domain 设置。

设置域名前先备份完整权威区、确认现有绑定归属，再完成账户所有权验证。Verify 可能解除其他账号尚未验证的 Pages 绑定，不能用来探测占用。验证值仅采用 GitHub 界面实时给出的 TXT，验证后保留。

根域使用 GitHub Pages 官方的四条 A，`www` 使用 CNAME：

| 主机 | 类型 | 值 |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `irissakura.github.io` |

先在 Pages 绑定，再修改实际权威区；不叠加冲突地址，不改 NS 或其他服务子域。现有 AAAA、CAA、代理与 URL 转发须先核对用途。等待有效证书后启用 Enforce HTTPS。

## 验收与证据

候选在隔离环境集中运行 `npm run check`、`npm run test:smoke`、`npm run package:site`。保留所有应跟踪的生成结果，确保 CI 的生成同步检查不会产生 diff。

生产验收同时检查：

1. 根域、`www` 和旧域名的 HTTP/HTTPS 首页及一篇正式深页，跳转到正式 HTTPS 域名且保留路径、查询参数。
2. 真实 GET 与浏览器中的导航、搜索、订阅、移动菜单、深层文章和有效 404；元数据与资源均正常。
3. 发布 SHA 对应的同一次 CI run/attempt、verify、deploy 与 Pages artifact；对 artifact 中的首页、深页、Sitemap 和实际 CSS/JS 与线上解码后的内容作 SHA-256 对照。
4. 对照切换前后其他服务的记录类型、值与配置 TTL。缓存剩余 TTL 自然递减不代表配置改变。

Technical、Functional、Outcome 分别记录。本地通过不代表 CI 或新域名上线通过；DNS、证书、账户验证、部署或线上内容对应核验缺失时列明具体未完成项。

## 浏览器验收问题记录（2026-11-02）

首次完整 Smoke 在 Journal 离屏归档标签的共享几何检查中失败，读取到默认边框与字号。该区域使用 `content-visibility:auto`；原步骤仅将卡片滚入视口，未确保被测标签自身呈现。本批修正测量前的真实滚动目标为标签，保留全部原有几何断言，不修改页面 CSS 或批准值。复查以完整 Smoke 的实际结果为准；不能把未渲染子树的默认值直接判定为已观察到的界面样式回归。

## 回滚

优先修复网站代码，不因局部问题改 DNS。完整撤回时先依据备份移走/恢复 `@`、`www`，保留账户验证 TXT，评估权威区和缓存收敛后再解除 Pages 绑定；受控撤回本批代码并部署，验证旧站首页及深页。若切换前根域没有地址记录，恢复原 DNS 将使新域名不再提供网站，不能承诺同时保持新旧入口可用。

## 官方说明

- [Pages 自定义域、IP 与 Actions 的 CNAME 行为](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [账户所有权验证与已占用域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [HTTPS 与 CAA 排错](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)
