# IrisSakura Personal Website — Productization Phase I

## 0. 文档目的

对当前 `IrisSakura/irissakura.github.io` 个人网站执行一次完整的 **Website Productization Phase I**。

本轮不进行视觉重构，不迁移框架，不引入后端，不改变网站的静态优先架构。

目标是在现有成熟的：

- 静态生成系统；
- JSON / Markdown 事实源；
- Publication Contract；
- GitHub Pages 发布；
- CI；
- Playwright Smoke Test；
- Brand System；
- 六花 Brand Mode 与多项目内容体系；

之上，一次性补齐以下五组能力。下文 Workstream A–H 是这五组能力的实施与验收拆分，不是八个独立交付批次：

1. Privacy-friendly Analytics 与站内行为事件；
2. 全站 Search / Cmd+K Discovery；
3. Related Content / Project / Research Knowledge Graph；
4. Accessibility + Performance + Core Web Vitals 基线；
5. JSON-LD + Search Engine Indexing Governance。

最终目标不是继续把网站“做漂亮”，而是让它从：

> 完整的个人项目展示网站

进一步成为：

> 可发现、可观察、可导航、可持续增长、可由 Agent 长期维护的个人 Web Presence。

---

# 1. 本轮非目标

以下内容明确不属于本轮。

不得因为实施本任务顺手引入：

- React；
- Vue；
- Next.js；
- Astro；
- Nuxt；
- SPA Router；
- SSR；
- Backend；
- Database；
- Account / Login；
- CMS；
- 评论系统；
- Newsletter 后端；
- Contact Form 后端；
- 用户追踪画像；
- Advertising tracking；
- Fingerprinting；
- Cookie Banner，除非最终选择的 Analytics 实现真实需要 Cookie；
- 重写现有 Generator；
- 大规模拆分现有页面；
- 无关视觉翻新；
- 六花品牌体系重新设计。

也不要为了所谓“现代前端最佳实践”推翻现有 Static First 架构。

当前架构仍为基线：

```text
Source Project / Curated Content
            ↓
Importer / Publication Contract
            ↓
Structured Data
            ↓
Static Generator
            ↓
HTML / CSS / Minimal JS
            ↓
GitHub Pages
```

本轮所有能力必须适应此架构，而不是反过来要求架构迁就功能。

---

# 2. 开始施工前必须确认的仓库事实

首先读取并理解：

```text
README.md
AGENTS.md
package.json

config/
data/
content/
components/
src/
scripts/
tests/

.github/workflows/site-quality-and-pages.yml
```

重点检查：

```text
scripts/generate-site.mjs
scripts/prepare-pages.mjs
scripts/verify-site.mjs
tests/browser-smoke.mjs
tests/content-search.test.mjs
tests/site-governance.test.mjs
tests/responsive-layout.test.mjs
tests/social-image.test.mjs
config/site-presentation.json
config/brand.json
data/site.json
data/projects.json
data/blog-taxonomy.json
data/evidence-chains.json
data/framework.json
data/framework-adoption.json
data/search-index.json
data/journal-source.json
config/blog-publication.json
scripts/lib/content-search-model.mjs
scripts/lib/blog-discovery-model.mjs
scripts/lib/evidence-chain-model.mjs
```

注意：

当前仓库已经存在 `content-search.test.mjs`、`scripts/lib/content-search-model.mjs`、`data/search-index.json` 和 Journal 页的内容搜索。现有索引覆盖正式文章、公开游戏设计和框架审计，尚未覆盖全站页面、项目与 Framework 能力；现有页面内搜索也没有全站入口和 Cmd/Ctrl+K 对话框。

因此：

**禁止直接假设“搜索完全不存在”。**

必须先调查现有 Search 相关代码和测试究竟已经承担什么职责，再决定：

- 扩展；
- 接管；
- 补齐；
- 或替代内部实现。

同理：

SEO、Social Metadata、Canonical、Sitemap、RSS、Brand Mode、JSON-LD、Skip Link、焦点样式和 Reduced Motion 处理均已存在。现有文章相关推荐基于系列、标签及近期文章回退；Evidence Chain 和 Framework 知识页面已有各自的关系语义，但还不是本轮所需的跨内容关系模型。

公开边界有一项必须在新增 Search / Graph 前修正：`scripts/prepare-pages.mjs` 当前复制整个 `data/`，只显式排除 `data/consumer-lab.json`；部分源数据包含 `sourceCommit` 等维护字段。仓库内事实源可以保留这些字段，发布包必须改为显式公共投影或白名单，不再依靠新索引单独脱敏来保证 `_site/` 安全。这个问题属于本轮公开产物验收前提。

实施前重新检查当前分支、上游提交和既有 staged、unstaged、untracked 文件；本方案不授权覆盖这些内容，也不授权 commit、push 或发布。

本轮原则不是重复实现已有功能，而是：

> 在现有能力之上补齐产品级闭环。

---

# 3. 总体架构要求

建议最终形成：

```text
                         Website
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
   Discovery            Knowledge           Observability
       │                    │                    │
 Search / Cmd+K        Related Graph        Analytics
       │                    │                    │
       └──────────────┬─────┴──────────────┬─────┘
                      │                    │
                 Accessible           Search Engine
                 & Performant          Understanding
                      │                    │
                A11y / CWV             JSON-LD
```

所有系统尽量：

- build-time generation；
- deterministic；
- data-driven；
- progressive enhancement；
- JS disabled 时核心内容仍可阅读；
- 无网络 API 时核心页面仍正常运行。

---

# 4. Workstream A — Privacy-Friendly Analytics

## 4.1 目标

网站应该能够回答：

- 哪些页面有人访问；
- 用户从哪里进入；
- 哪些项目入口被点击；
- 哪些外部 GitHub 链接被点击；
- Framework Quickstart 是否被使用；
- RSS 入口是否有人点击；
- Blog → Project 是否发生跨内容导航；
- Contact 入口是否被使用；
- Search 是否有人使用；
- Search 后用户点击了什么；
- 哪些主要 CTA 真正有效。

但不得建立用户画像。

---

# 4.2 Privacy Contract

新增：

```text
config/analytics.json
```

建议结构：

```json
{
  "enabled": false,
  "provider": "none",
  "privacyMode": true,
  "trackPageViews": true,
  "trackOutboundLinks": true,
  "events": {
    "search": true,
    "searchResultOpen": true,
    "projectOpen": true,
    "articleOpen": true,
    "frameworkQuickstart": true,
    "rssOpen": true,
    "contactOpen": true,
    "externalRepositoryOpen": true
  }
}
```

字段可根据现有项目风格调整。

核心原则：

### 不允许记录

- 搜索输入的完整原文；
- Email；
- QQ；
- 联系信息；
- URL Query 中潜在敏感信息；
- 主动采集、发送或在站点侧存储 IP；如选择第三方服务，还需核对其接收请求时的 IP 处理与保留政策；
- 用户 ID；
- Browser fingerprint；
- Local Storage persistent identity；
- 跨站身份。

Search Event 可以记录：

```text
queryLength
resultCount
category
```

但默认不要发送：

```text
queryText
```

页面浏览和来源统计只传已审核的站内路径与来源站点，不传完整 query、fragment、完整 Referrer URL 或联系信息。若 Provider 默认自动采集完整 URL / Referrer，必须先关闭或约束该行为，再允许启用。

---

# 4.3 Analytics Adapter

不要把 Provider SDK 调用散落在页面中。

建立统一前端入口，例如：

```text
src/analytics.ts
```

对外只提供：

```ts
trackPageView(...)
trackEvent(...)
trackOutbound(...)
```

或者等价 API。

页面和组件不得直接：

```js
window.someAnalyticsVendor(...)
```

---

# 4.4 Provider 激活策略

第三方 Analytics 可能需要外部账户和站点标识。本轮必须把：

> 代码能力

与：

> Provider Account Activation

分开。

要求：

### 仓库内完成

- analytics adapter；
- 配置模型；
- event taxonomy；
- DOM wiring；
- privacy contract；
- 一个经隐私合同审查、可由配置启停的具体 Provider 适配实现；
- tests；
- documentation。

Provider 在本轮确定，并验证其无需用户画像、指纹或跨站身份。仓库内用 Mock Provider 验证事件；真实账户激活由站点 Owner 后续完成。

### 未激活时

```text
analytics.enabled = false
```

网站：

- 不报错；
- 不加载外部分析脚本；
- 不发送请求；
- 所有行为完全正常。

### 获得站点标识后

只修改集中配置即可激活，不修改业务页面。静态前端只能使用允许公开的站点标识；需要保密的 API Key、写入凭据或服务端 Token 不得进入生成 HTML、JS、JSON 或 `_site/`。若候选 Provider 必须把秘密放在浏览器里才能工作，它不适合本轮无后端架构。

不得把站点标识散落硬编码进多个 HTML 页面。未激活的配置不能输出空 SDK 脚本或发起分析请求。

---

# 4.5 Event Taxonomy

统一事件名称。

推荐：

```text
navigation.search_open
navigation.search_result_open

content.article_open
content.project_open
content.related_open

framework.quickstart_open

external.repository_open
navigation.rss_open
external.contact_open
```

保持：

```text
namespace.action
```

不要：

```text
clickButton1
homeClick
linkTest
```

---

# 4.6 Outbound Tracking

对：

```text
github.com
外部文档
RSS
邮件入口
其他公开主页
```

统一通过事件委托追踪。RSS 是站内资源，邮件入口是 `mailto:` 动作；事件按行为语义分类，不把两者误判为普通站外 HTTP 链接。事件参数只使用允许的分类、公开内容 ID 和安全路径，不发送完整 `href`、邮件地址或 URL query。

不得在每一个 `<a>` 标签里手写监听器。

---

# 5. Workstream B — 全站 Search / Cmd+K

## 5.1 产品目标

网站内容已经超过传统导航能够自然覆盖的规模。

实现：

```text
Ctrl + K
Cmd + K
```

打开全站 Discovery UI。

同时提供明显的 Search 入口。

移动端必须可访问。

---

# 5.2 搜索范围

至少覆盖：

### Pages

```text
Projects
Engineering
Framework
Quickstart
Journal
Tools
Mods
Wisteria
Game
Portfolio
Now
Brand
Contact
```

### Articles

```text
title
summary
series
tags
```

### Projects

```text
name
summary
responsibility
status
keywords
```

### Framework

```text
modules
capabilities
architecture concepts
quickstart concepts
```

### Research / Journal

只允许搜索当前公开 projection。

不得把：

- 私有文件；
- source SHA；
- owner-only metadata；
- unpublished content；

加入公开索引。

---

# 5.3 Build-Time Search Index

现有 `scripts/lib/content-search-model.mjs` 与 `data/search-index.json` 是 Journal 页的搜索合同，包含该页面专用的分类、筛选和结果语义。全站 Discovery 增加页面、项目和 Framework 能力后，使用独立的 `data/site-search-index.json`，避免改变 Journal 消费者的合同。两份索引由同一次 Generator 构建，从同一组已发布事实与公开投影派生；Journal 保留原入口，全站对话框只读取全站索引。Generator 构建并维护两个公开路径：

```text
data/search-index.json
data/site-search-index.json
```

发布包显式包含两份索引，分别验证 Journal 检索与全站检索；它们的用途和结构在 `docs/architecture/search.md` 中说明。

推荐数据：

```json
{
  "schemaVersion": 1,
  "totalCount": 1,
  "documents": [
    {
      "id": "article:example",
      "type": "article",
      "title": "示例标题",
      "summary": "示例摘要",
      "url": "/pages/blog/example.html",
      "keywords": [],
      "projectId": null,
      "series": "",
      "tags": []
    }
  ]
}
```

这只是全站索引结构示意；实际合同以生成器和测试为准，示例不授权发布虚构条目。Journal 索引继续保持现有 facets 与 entries 合同。

不要索引整篇 HTML。

原则：

```text
搜索索引服务 Discovery
不是全文数据库。
```

正文可根据实际情况抽取适量 searchable text，但必须控制体积。

索引中的 `generatedAt` 不得取构建时钟；相同输入的两次构建应产生字节相同的受版本控制产物。内部事实源中的路径、提交 SHA 与维护字段必须在公开索引生成前被显式投影掉。

---

# 5.4 Search Ranking

至少支持：

```text
exact title
prefix title
keyword
tag
series
summary
body excerpt
```

权重：

```text
Title
>
Explicit Keywords / Tag
>
Project / Series
>
Summary
>
Body
```

搜索结果不能随机排序。

相同输入必须 deterministic。

---

# 5.5 中文与英文

站点存在：

- Chinese；
- English technical terms；
- CamelCase；
- Repository names；

因此搜索至少正确处理：

```text
SakuraGameFramework
object pool
对象池
framework
Wisteria
Myosotis
```

不要求本轮引入复杂 NLP。

允许：

- normalize；
- lowercase；
- tokenization；
- ASCII term；
- Chinese substring matching。

优先保证可靠，而不是智能。

---

# 5.6 UI

搜索层建议包含：

```text
Search IrisSakura

[ input ]

Projects
...

Articles
...

Framework
...

Research
...
```

支持：

```text
↑
↓
Enter
Esc
Cmd/Ctrl + K
```

需要：

- keyboard navigation；
- visible focus；
- proper dialog semantics；
- focus trap；
- Esc close；
- close 后 focus 回到原触发元素；
- screen reader label。

---

# 5.7 URL

点击 Search Result 应进入已有 Semantic URL。

不得引入新的客户端路由系统。

---

# 5.8 Empty State

包括：

```text
输入为空
无结果
加载失败
索引不可用
```

Index 加载失败时不得影响页面其他功能。

---

# 6. Workstream C — Related Knowledge Graph

## 6.1 目标

把现在已有的：

```text
Projects
Articles
Research
Framework
Consumer
Mods
```

从“并列目录”升级为可导航关系网络。

最终：

```text
Article
 ↓
Research
 ↓
Framework Capability
 ↓
Consumer
 ↓
Project
```

可以自然跳转。

---

# 6.2 原则

关系必须：

```text
Evidence Based
```

禁止让 Generator 根据文本相似度自行“猜关系”。

允许来源：

- explicit IDs；
- project attribution；
- tags；
- series；
- evidence chains；
- framework adoption；
- consumer mapping；
- publication metadata。

现有 `scripts/lib/blog-discovery-model.mjs` 在没有共享系列或标签时会回退到近期正式文章。本轮把它纳入统一关系规则时，必须去掉这种无关系依据的回退；没有可验证关联就不显示 Related 区块。不要把“排序确定”误当作“关系有证据”。

---

# 6.3 Canonical Relationship Model

优先新增独立的公开内容关系源：

```text
data/content-relations.json
```

现有证据链可作为关系输入，但不要直接扩展其原有合同来承载所有推荐语义：

```text
data/evidence-chains.json
```

但不要污染 Evidence Chain 原有语义。

推荐独立关系模型：

```json
{
  "version": 1,
  "relations": [
    {
      "from": "article:xxx",
      "to": "framework:object-pool",
      "type": "explains"
    }
  ]
}
```

合法关系类型：

```text
belongs-to
explains
researches
implements
uses
validates
extends
related
```

不要无限增加语义。

---

# 6.4 Automatic + Explicit

可以存在两个来源：

### Explicit Relations

人工确定：

```text
article A → project B
consumer C → framework module D
```

### Deterministic Derived Relations

例如：

```text
相同 series
相同 project ID
相同 framework capability
相同 evidence chain
```

但 Derived 规则必须写成明确代码和测试。

所有端点必须先映射到稳定、已发布且可访问的公共内容 ID；仅在同一受控字段确实表达关系时派生，不能仅因词语相近或“近期”而派生。每条关系保留可测试的来源规则，输出顺序固定，缺失或未发布端点在构建时失败或被明确排除。

禁止：

```text
AI inferred relationship
```

进入正式构建。

---

# 6.5 Related Content UI

在适合的页面底部加入：

```text
Related
```

分组：

```text
Related Research
Related Articles
Related Projects
Related Framework
Related Implementations
```

最多建议：

```text
3–6 items
```

避免页面底部再次变成完整目录。

---

# 6.6 Article 页面

文章页至少应尝试展示：

```text
Series
Tags
Related Articles
Related Project
Related Research / Framework
```

没有关联时：

```text
不显示 section
```

不要写：

```text
No related content available
```

---

# 6.7 Project 页面

可以展示：

```text
Related Writing
Research
Framework Capability
Consumers
```

但只显示真实关系。

---

# 6.8 Graph 数据复用

Knowledge Graph 同时可以供：

```text
Search ranking
Related content
JSON-LD
Future visualization
```

使用。

因此 ID 必须稳定。

---

# 7. Workstream D — Accessibility Baseline

## 7.1 目标

建立网站正式 Accessibility Contract。

目标基线：

```text
WCAG 2.2 AA
```

不要求为了极端情况破坏整体视觉。

但核心内容和操作必须可访问。

---

# 7.2 全站检查

检查：

```text
html lang
document title
heading hierarchy
landmarks
header
nav
main
footer
article
section
button semantics
link semantics
form label
image alt
decorative image
keyboard
focus
touch target
contrast
motion
dialog
aria
```

---

# 7.3 Skip Link

所有主页面提供：

```text
Skip to main content
```

视觉默认隐藏。

Keyboard focus 后显示。

---

# 7.4 Focus

禁止：

```css
outline: none;
```

除非存在同等明显的 replacement。

所有：

```text
Link
Button
Search Result
Navigation
Modal
```

必须有：

```text
:focus-visible
```

---

# 7.5 Reduced Motion

检查现有 Ambient Visual / Decorative Animation。

实现：

```css
@media (prefers-reduced-motion: reduce)
```

至少关闭：

- non-essential animation；
- background drift；
- continuous motion；
- transition-heavy effects。

功能不能依赖 animation 完成。

---

# 7.6 Image Semantics

区分：

### Content Image

必须有描述性 alt。

### Decorative Persona / Ornament

使用：

```html
alt=""
```

并避免 Screen Reader 读取冗余内容。

---

# 7.7 Search Dialog

Search 必须成为本轮主要 A11y 测试对象：

- open；
- type；
- arrow navigation；
- enter；
- escape；
- focus restoration；
- screen reader semantics。

---

# 7.8 Automated Test

在现有 Playwright 基础上增加 accessibility regression。

允许增加成熟的 accessibility test dependency。

最低要求扫描：

```text
Home
Projects
Blog
Article
Framework
Journal
Contact
Search Dialog
```

CI 中 fail on serious / critical accessibility violations。

自动扫描通过只构成本轮回归基线，不等于完整的 WCAG 2.2 AA 符合性声明；键盘、焦点、语义、对比度和主要内容流程还需人工及浏览器验收。符合性判断以 [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) 为准。

---

# 8. Workstream E — Performance Baseline

## 8.1 原则

不要为了追求 Lighthouse 100 删除网站特色。

目标：

> 防止以后逐渐变慢。

---

# 8.2 Performance Budget

新增：

```text
config/performance-budget.json
```

初始值必须根据当前站点实际测量制定。

不要先拍脑袋写一个所有页面都会失败的预算。

至少约束：

```text
HTML bytes
CSS bytes
JS bytes
Image bytes
Request count
Search index bytes
Largest asset
```

---

# 8.3 推荐目标

在当前实际 baseline 合理的情况下，目标倾向：

```text
LCP <= 2.5 s
CLS <= 0.10
INP <= 200 ms
```

这些是目标线。

CI 中如果实验环境波动明显，不要直接对单次毫秒值做脆弱断言。

CI 优先检查：

```text
asset budget
layout shift regression
major navigation interaction
search response
blocking script
```

---

# 8.4 Image

全面审计：

```text
WebP
width / height
loading=lazy
decoding=async
hero priority
responsive images
oversized images
```

Hero 不应 lazy load。

非首屏图片应合理 lazy load。

---

# 8.5 JS

网站为 Static First。

要求：

```text
Search
Analytics
Ambient Interaction
```

均保持轻量。

不要为了 Search 引入数百 KB 搜索框架，除非仓库实际规模证明必要。

---

# 8.6 CSS

避免：

- 大量重复 page-local CSS；
- 不必要 blocking font；
- 重复品牌样式；
- unused visual legacy。

但本轮不是 CSS 重构项目。

只处理明确影响 Performance / Accessibility 的内容。

---

# 8.7 Font

检查：

```text
font-display
fallback
FOIT
```

如使用外部字体，应保证失败时可正常阅读。

---

# 9. Workstream F — Core Web Vitals Test

在 Browser Smoke 基础上增加 Performance Probe。

至少记录：

```text
navigation timing
resource timing
layout shift
LCP candidate
```

Search / Navigation 的 scripted interaction 用于检查实验室交互延迟与回归，不把少量脚本交互结果标为真实用户 INP。INP 涵盖一次页面访问中的交互响应，正式现场指标与实验室诊断应分开记录；定义参见 [web.dev 的 INP 说明](https://web.dev/articles/inp)。

不要把实验室数据描述成真实用户数据。

测试输出：

```text
tests/output/performance-baseline.json
```

或 ignored artifact。

不要提交机器相关的不稳定结果。

提交：

```text
budget
test logic
reference threshold
```

---

# 10. Workstream G — Structured Data / JSON-LD

## 10.1 目标

目前 SEO 已经有：

```text
meta
canonical
sitemap
robots
OpenGraph
Social Card
RSS
基础 JSON-LD（由 `buildMeta` 生成）
```

本轮审查现有结构化数据与页面真实语义，再补齐：

```text
Machine Understandable Entity Layer
```

---

# 10.2 WebSite

首页生成：

```text
WebSite
```

至少：

```text
name
url
description
publisher / author relation
```

---

# 10.3 Person

首页 / Contact：

```text
Person
```

只使用公开事实。

禁止根据仓库内容推断：

- 职位；
- 雇主；
- 学历；
- 地理位置；
- 未公开社交账号。

---

# 10.4 Article

正式 Blog：

```text
BlogPosting
```

包含：

```text
headline
description
datePublished
dateModified
author
url
image
keywords
articleSection
```

数据必须来自 Publication Contract。

当前 Generator 已为正式文章和部分研究页输出 `Article`。正式 Blog 的 `BlogPosting` 字段按出版合同补齐；研究摘要页按实际公开内容选择类型，不能把未出版摘要伪装成正式 BlogPosting。

---

# 10.5 Software / Project

SakuraGameFramework 等公开软件项目，可以根据真实语义选择：

```text
SoftwareSourceCode
SoftwareApplication
CreativeWork
```

不要为了 Rich Result 强行使用错误类型。

例如：

SakuraGameFramework 更适合：

```text
SoftwareSourceCode
```

游戏项目：

```text
VideoGame
```

只有数据足够时才生成。

---

# 10.6 Breadcrumb

非首页主要页面生成：

```text
BreadcrumbList
```

例如：

```text
Home
→ Projects
→ SakuraGameFramework
```

文章：

```text
Home
→ Writing
→ Series
→ Article
```

---

# 10.7 SearchAction

只有网站 Search 存在可表达的真实 URL 查询语义时才生成。

如果 Search 完全是客户端 Dialog，没有稳定：

```text
/search?q=
```

则不要伪造：

```text
SearchAction
```

---

# 10.8 JSON-LD Generation

继续统一由 Generator 生成，在现有 `buildMeta` 入口或本轮新增的确定性模块中扩展，不再并行维护第二套散落的 JSON-LD。

不得手写散落在各 HTML。

建议形成：

```text
buildStructuredData(pageContext)
```

或者等价模块。

---

# 11. Workstream H — Indexing Governance

## 11.1 页面索引状态

建立明确规则：

### index

正式：

```text
Home
Projects
Project Pages
Blog
Articles
Framework
Journal Public Pages
Mods
Portfolio
Now
Contact
Brand
```

### noindex

明确兼容跳转：

```text
about.html
art-music.html
```

以及：

- legacy compatibility；
- duplicate routes；
- internal utility pages；
- 不应该出现在搜索结果中的 redirect shell。

---

# 11.2 Canonical

所有 index 页面必须有唯一 canonical。

Redirect / legacy 页面不得与正式页面竞争。

---

# 11.3 Sitemap

Sitemap 只包含：

```text
canonical indexable pages
```

禁止加入：

```text
noindex
redirect
internal-only
generated diagnostics
```

---

# 11.4 Robots

确认 `robots.txt`：

- 不意外 block 正式内容；
- 指向 sitemap；
- 不把 robots 当成 private security boundary。

---

# 11.5 Search Console Readiness

由于 Search Console 本身需要站点所有者登录搜索引擎账户，本轮仓库侧必须准备：

```text
HTML verification file support
或
meta verification config
```

建立：

```text
config/search-engine-verification.json
```

例如：

```json
{
  "google": null,
  "bing": null
}
```

未配置时：

```text
不输出空 verification tag。
```

配置后：

```text
Generator 自动写入。
```

Agent 不得：

- 猜 token；
- 假造 verification；
- 在公开文档里伪称 Search Console 已激活。

---

# 12. Search Console / Webmaster 外部步骤文档

新增：

```text
docs/operations/search-engine-registration.md
```

说明站点 Owner 后续只需要完成：

```text
1. 创建 URL Prefix Property
2. 获得 verification token
3. 写入 config
4. build
5. deploy
6. Verify
7. submit sitemap.xml
```

如果使用 verification file，则对应调整。

外部账号动作不是本轮仓库实现阻塞项。

---

# 13. Generator 架构治理

当前：

```text
scripts/generate-site.mjs
```

已经承担大量职责。

本轮不要进行全面重构。

但是新系统不能继续把数千行新逻辑全部塞进去。

允许创建：

```text
scripts/lib/search-index.mjs
scripts/lib/content-relations.mjs
scripts/lib/structured-data.mjs
scripts/lib/performance-budget.mjs
```

或者符合当前仓库风格的等价模块。

原则：

```text
generate-site.mjs
= orchestration

lib/
= deterministic domain logic
```

但只迁移本轮新增职责。

不要顺手搬迁所有历史 Generator 逻辑。

---

# 14. Public Asset Boundary

确认以下 owner-only 内容绝不进入：

```text
_site/
```

先修正当前 `scripts/prepare-pages.mjs` 的发布边界：它现在复制整个 `data/`，仅排除 `data/consumer-lab.json`，而部分源 JSON 含 `sourceCommit`。将发布包改为显式公共文件白名单或等价的最小公共投影；保持仓库内 importer 与 Generator 所需的原始事实源，不直接删除其维护字段。新增索引和关系产物只能读取经审核的公开字段。

新增 Search / Graph 后尤其重新验证：

- private Journal source path；
- source SHA；
- local absolute path；
- provenance；
- internal repository location；
- unpublished article；
- owner-only consumer metadata；
- secrets；
- analytics secret；
- workflow token。

对整个 `_site/` 扫描，而不只对以下新增产物扫描：

```text
search-index.json
content graph
JSON-LD
```

增加 artifact scanning tests。

---

# 15. Progressive Enhancement

关闭 JavaScript 后必须仍然：

```text
Home 可读
Article 可读
Projects 可导航
Framework 文档可读
Contact 可访问
RSS 可获取
```

可以失去：

```text
Cmd+K
interactive search
analytics
```

但不能失去主要内容。

---

# 16. Tests

新增或扩展：

```text
tests/search-ui.test.mjs
tests/content-relations.test.mjs
tests/structured-data.test.mjs
tests/accessibility.test.mjs
tests/performance-budget.test.mjs
tests/analytics-contract.test.mjs
tests/indexing-governance.test.mjs
```

名称根据当前测试体系调整。

不要为了文档中的文件名破坏现有 conventions。

---

# 17. Search Test

必须覆盖：

```text
exact title
English
Chinese
CamelCase
tag
series
no result
keyboard
Esc
Enter
arrow navigation
mobile
index missing fallback
```

---

# 18. Graph Test

检查：

```text
all IDs exist
no broken relation
valid relation type
no private target
no duplicate relation
deterministic result
related section links valid
```

---

# 19. JSON-LD Test

解析每个：

```text
<script type="application/ld+json">
```

必须：

- valid JSON；
- valid URL；
- date format valid；
- canonical consistent；
- entity ID valid；
- 不包含 private metadata。

---

# 20. Analytics Test

Analytics disabled：

```text
0 analytics network dependency
0 runtime error
```

Analytics enabled in test fixture：

```text
page view
search event
related click
external link
```

均正确调用 Adapter。

不得检查真实第三方服务器。

Mock Provider。

---

# 21. Accessibility Test

至少：

```text
Home
Development
Blog
Article
Framework
Journal
Contact
Search
```

跑自动检查。

再用 Playwright 明确检查：

```text
Tab order
Search keyboard
Focus restore
Skip link
Reduced motion
```

---

# 22. Performance Test

本地 production build 后：

- 启动 static server；
- 浏览主要页面；
- 收集 resource；
- 校验 budget。

覆盖：

```text
/
development
framework
journal
blog
article
```

不要只测首页。

---

# 23. Indexing Test

检查：

```text
index page → canonical
index page → sitemap
noindex page → not sitemap
legacy page → noindex
robots → sitemap
```

---

# 24. Browser Smoke 扩展

现有：

```text
tests/browser-smoke.mjs
```

增加完整用户流：

### Flow A

```text
Home
→ Cmd+K
→ Search "Sakura"
→ Framework
→ Quickstart
```

### Flow B

```text
Blog
→ Article
→ Related Research
```

### Flow C

```text
Project
→ Related Article
→ Back
```

### Flow D

```text
Mobile
→ Search
→ Result
→ Navigation
```

---

# 25. Documentation

更新：

```text
README.md
```

新增：

```text
docs/architecture/search.md
docs/architecture/content-graph.md
docs/operations/analytics.md
docs/operations/search-engine-registration.md
docs/quality/accessibility.md
docs/quality/performance.md
```

保持文档面向维护者。

不要把这些治理文案输出到公开页面。

---

# 26. README 最终应说明

至少补：

```text
Search index source
Relation source
Analytics activation
Accessibility baseline
Performance budget
Structured data
Search engine verification
```

---

# 27. 不允许出现的实现

本轮拒绝：

## 搜索

```text
第三方 SaaS Search
```

除非现有静态方案经验证完全无法满足。

当前规模应优先本地 static search。

---

## Analytics

禁止：

```text
user fingerprint
session replay
heatmap
advertising analytics
cross-site tracking
```

---

## Related Content

禁止：

```text
随机相关推荐
AI 在线推荐
运行时 Embedding API
```

---

## SEO

禁止：

```text
keyword stuffing
隐藏文字
虚假 SoftwareApplication Rating
虚假 Review
虚假 Organization
```

---

## Performance

禁止为了分数：

- 删除核心品牌视觉；
- 删除项目截图；
- 破坏设计系统；
- 全面降级动效。

应该优化：

```text
delivery
loading
format
budget
```

而不是砍掉设计。

---

# 28. 最终构建流程

Agent 完成全部代码后，再统一执行：

```bash
npm ci
npm run check
npm run test:smoke
npm run package:site
```

如果新增了专门命令，例如：

```bash
npm run test:a11y
npm run test:performance
```

则将其并入：

```text
npm run check
```

或 CI Candidate Acceptance。

避免开发过程中每做一个小改动就反复跑完整验收。

---

# 29. CI

更新：

```text
.github/workflows/site-quality-and-pages.yml
```

最终 pipeline 至少包含：

```text
JSON integrity
Generate
TypeScript
Unit tests
Site validation
Search validation
Graph validation
Structured Data validation
Accessibility
Performance budget
Browser smoke
Package
Deploy
```

其中 Performance 不得设置成极端不稳定的毫秒级硬断言。

---

# 30. Build Determinism

在记录既有 Git 状态及本轮预期文件后，连续运行；每次构建后分别记录受控生成文件的内容哈希：

```bash
npm run build
npm run build
```

比较两次构建后本轮受控生成文件的内容或哈希；同时检查相对基线的 `git diff`。既有未跟踪文件和先前改动不能被误判为本轮构建漂移，也不能被清理、重置或覆盖。

不得产生：

- 随机顺序；
- 时间戳污染；
- 非必要 generated changes。

注意：

Search Index / Graph 如果包含 `generatedAt`，不要让它污染 tracked artifact determinism。

---

# 31. Final Acceptance Matrix

## Search

- [ ] Desktop Search 可打开
- [ ] Mobile Search 可打开
- [ ] Cmd+K / Ctrl+K
- [ ] Keyboard 完整
- [ ] 中英文可搜索
- [ ] Framework 可搜索
- [ ] Article 可搜索
- [ ] Project 可搜索
- [ ] Research 可搜索
- [ ] 无 private 数据
- [ ] JS failure 不影响阅读

---

## Related Graph

- [ ] Article → Related
- [ ] Project → Related
- [ ] Research → Related
- [ ] Framework → Related
- [ ] 所有 ID 有效
- [ ] 所有 relation deterministic
- [ ] 无 inferred hallucination

---

## Analytics

- [ ] Provider abstraction
- [ ] disabled 默认安全
- [ ] page view
- [ ] search event
- [ ] result event
- [ ] related navigation
- [ ] outbound link
- [ ] RSS
- [ ] repository
- [ ] contact
- [ ] 不记录 query text
- [ ] 不记录 PII
- [ ] 无 fingerprint

---

## Accessibility

- [ ] WCAG 2.2 AA baseline
- [ ] Skip link
- [ ] keyboard navigation
- [ ] focus visible
- [ ] search dialog accessible
- [ ] heading hierarchy
- [ ] landmarks
- [ ] decorative alt
- [ ] reduced motion
- [ ] serious / critical violation = 0

---

## Performance

- [ ] Performance budget committed
- [ ] HTML budget
- [ ] CSS budget
- [ ] JS budget
- [ ] image budget
- [ ] Search Index budget
- [ ] CLS baseline
- [ ] LCP lab baseline
- [ ] key interaction tested
- [ ] Hero loading correct
- [ ] below-fold lazy load

---

## SEO

- [ ] canonical
- [ ] sitemap
- [ ] robots
- [ ] WebSite JSON-LD
- [ ] Person JSON-LD
- [ ] BlogPosting
- [ ] BreadcrumbList
- [ ] appropriate software/project schema
- [ ] no fake schema claims
- [ ] verification configuration
- [ ] Search Console setup guide

---

# 32. 最终人工浏览尺寸

至少实际浏览：

```text
360 × 800
390 × 844
430 × 932
768 × 1024
1024 × 768
1280 × 800
1440 × 900
1728 × 1117
1920 × 1080
```

重点：

```text
Home
Search
Article
Framework
Journal
Project
Contact
```

---

# 33. 验收时特别检查六花体系

新 Search / Related 模块不能把所有页面重新视觉统一成同一个通用 Card System。

继续尊重现有：

```text
Iris
Sakura
Myosotis
Violet
Freesia
Wisteria
```

各自视觉语言。

Search Overlay 可以属于：

```text
IrisSakura global shell
```

但进入内容后仍保持页面 Brand Mode。

---

# 34. Expected Repository Result

完成后仓库大致拥有：

```text
config/
├── analytics.json
├── performance-budget.json
└── search-engine-verification.json

data/
└── content-relations.json

scripts/
└── lib/
    ├── search-index.*
    ├── content-relations.*
    └── structured-data.*

src/
├── analytics.*
└── search.*

docs/
├── architecture/
│   ├── search.md
│   └── content-graph.md
├── operations/
│   ├── analytics.md
│   └── search-engine-registration.md
└── quality/
    ├── accessibility.md
    └── performance.md
```

这是建议结构。

如果当前代码已经存在适合的对应模块，则复用现有结构，不要机械创建重复文件。

---

# 35. External Dependencies

本任务最终可能仍存在两个不能仅靠仓库代码完成的外部动作：

### Analytics Provider

需要：

```text
创建 Site
获取允许公开的站点标识，核对 Provider 的隐私与网络行为
```

### Search Engine Console

需要：

```text
站点 Owner 登录
Verification
Submit Sitemap
```

Agent 必须：

> 把仓库准备到只需填写允许公开的站点标识 / Search Engine Verification Value 就能激活；任何必须保密的凭据只能留在外部账户或 CI Secret，不能注入静态发布包。

不得因为外部凭据不存在而停止其他工作。

也不得虚构：

```text
Analytics 已上线
Search Console 已验证
```

---

# 36. Agent 执行原则

整个任务视为：

```text
一个完整版本
```

而不是五个独立小项目。

执行顺序应由依赖决定，例如：

```text
现状建模
        ↓
Canonical Content Identity
        ↓
Search Index
        ↓
Relation Graph
        ↓
Search UI
        ↓
Analytics Hooks
        ↓
Structured Data
        ↓
Accessibility
        ↓
Performance
        ↓
Index Governance
        ↓
Unified Validation
```

不要在完成：

```text
Search
```

后停下来等用户确认。

不要完成：

```text
JSON-LD
```

后再询问是否继续 Performance。

如果没有发现会改变整体产品方向的重大架构冲突，则：

> 连续推进直到完整 Candidate Build。

---

# 37. 遇到问题时的决策原则

优先级：

```text
Public Correctness
>
Privacy
>
Accessibility
>
Content Discoverability
>
Performance
>
Visual Enhancement
```

如果某项优化会：

- 删除真实内容；
- 破坏六花视觉；
- 降低信息密度；
- 引入大量客户端框架；
- 让 Generator 更难维护；
- 暴露 private projection；

则放弃该具体实现，采用更简单的方法。

---

# 38. Definition of Done

只有满足以下条件才算本阶段完成：

1. 网站拥有实际可用的全站 Search；
2. Cmd/Ctrl+K 可以快速发现内容；
3. 文章、研究、项目、Framework 之间出现真实关系导航；
4. Analytics instrumentation 已完整实现；
5. Analytics 未激活时网站正常运行，且不加载分析脚本或发出分析请求；
6. 站点拥有 Accessibility 自动基线；
7. 站点拥有 Performance Budget；
8. LCP、CLS 建立实验室基线，并记录关键交互延迟诊断；现场 INP 未接入前不得宣称已测得真实用户 INP；
9. 正式页面具有合理 JSON-LD；
10. Index / noindex / canonical / sitemap 逻辑一致；
11. Search Engine Verification 已配置成数据驱动；
12. 无 private 或 owner-only 信息进入整个 `_site/`，包括 Search / Graph / JSON-LD；
13. Existing URL 不发生非必要破坏；
14. Existing Publication Contract 不退化；
15. Existing 六花 Brand Mode 不退化；
16. 本地执行与 CI 对应的候选验收命令全部通过；若后续获授权推送，再核对对应提交的 CI 结果，未运行的远端 CI 不得宣称通过；
17. 新增测试全部通过；
18. Browser Smoke 全部通过；
19. `_site/` Artifact 验证通过；
20. 两次 Build deterministic；
21. 本轮改动只涉及已核对的预期文件，既有 staged、unstaged 和 untracked 内容保持原状；未获授权不 commit、push 或触发发布。

---

# 39. 最终提交报告

Agent 最终只需提供一份集中验收报告。

格式：

```markdown
# Website Productization Phase I — Completion Report

## Summary

## Architecture Changes

## Search

## Knowledge Graph

## Analytics

## Accessibility

## Performance

## Structured Data / SEO

## Indexing Governance

## Privacy Audit

## Tests

## Browser Validation

## Performance Baseline

## Generated Artifact Audit

## External Activation Required
- Analytics 公开站点标识及账户激活
- Search engine verification

## Known Limitations

## Files Changed

## Final Git Status
```

不要生成数份“阶段完成报告”。

---

# 40. 本轮结束后的产品状态

目标从：

```text
Portfolio
+
Project Documentation
+
Blog
```

进化为：

```text
IrisSakura Personal Web Presence

Discovery
├── Navigation
├── Search
└── Related Graph

Content
├── Projects
├── Writing
├── Research
├── Framework
├── Mods
└── Living Updates

Quality
├── Accessibility
├── Performance
├── Responsive
└── Browser Validation

Machine Layer
├── Sitemap
├── RSS
├── OpenGraph
├── JSON-LD
└── Canonical

Observability
└── Privacy-friendly Analytics
```

本阶段完成后，除独立域名之外，网站应该已经基本具备一个长期公开运行的成熟个人网站所需要的核心基础设施。

下一阶段不应继续凭感觉增加 Web 功能。

应先让网站运行一段时间，根据：

```text
Search Usage
Navigation Flow
Popular Projects
Popular Articles
Outbound Actions
Performance
Search Engine Discovery
```

判断是否真实需要：

```text
Newsletter
Contact Form
Comments
Backend Services
```

在出现真实使用需求以前，不提前增加这些维护成本。
