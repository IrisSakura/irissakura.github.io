# IrisSakura Website V2 — 全站视觉与页面架构翻新任务书

> 状态：Final / Agent Execution Specification  
> 目标：一次性完成 IrisSakura 个人网站从“V2 人格素材已接入，但页面仍由多代视觉规则叠加”到“统一设计系统 + 六种明确页面语法”的全站翻新。  
> 适用仓库：`IrisSakura/irissakura.github.io`（GitHub 源仓库；本地工作目录为 `/Users/hcm-b0647/WebstormProjects/irissakura.github.io`，遵守该仓库 `AGENTS.md`，不引入 Gitea 镜像或发布流程）  
> 视觉基线：`Six Flower Personas V2 Final`  
> 关联资产：六角色 V2 主视觉、透明 PNG、切图包、Persona V2 配置  
> 执行原则：**设计先行 → 连续实施 → 完整闭环后集中验收**  
> 文档修订：2026-09-22；现状核对基于网站提交 `91f5c4617f09dcf8b2320e13e5672b88cbe12680`。本文描述目标与实施约束，实际开工、提交、推送和发布以用户相应授权为准。

---

# 0. Executive Summary

本次任务不是局部修复 Blog，也不是继续给旧页面套 Persona 配色。

当前网站已经完成 Six Flower Personas V2 的素材迁移，但页面系统仍存在明显的“代际混合”：

- 六角色视觉已经 V2；
- 部分项目 Hero 已进入 V2；
- `journal.html` 等页面已经明显采用 Persona 化布局；
- 但 Blog、Article、Series、Tag 等深层页面仍沿用较早结构；
- CSS 存在较多“旧样式 + 后续覆盖”的 layering debt；
- 六个项目虽然已经出现在网站中，但它们尚未全部成为同等级的一等公民；
- 不同页面之间的特色主要仍靠颜色和角色图，而不是页面空间语法。

本轮目标是建立：

> **One Site · Six Visual Languages**

统一：

- Navbar
- Footer
- Typography
- Spacing
- Container
- Grid
- Component semantics
- Accessibility
- Motion
- Responsive behavior
- Content hierarchy

区分：

- Iris → Grid / Axis / Structure
- Sakura → Branch / Flow / Expansion
- Myosotis → Page / Archive / Connection
- Violet → Shelf / Desk / Drawer
- Freesia → Route / Card / Discovery
- Wisteria → Space / Layer / Continuity

要求即使临时去色、隐藏标题、模糊细节，六个项目页面仍应能通过布局和空间结构辨识。

---

# 1. 当前仓库基线与已发现问题

## 1.1 当前关键文件

主要配置：

```text
config/site-presentation.json
config/personas-v2.json
```

主要全局样式：

```text
style/main.css
style/iris-sakura.css
style/tokens/*
style/components/brand-experience.css
style/components/personas-v2.css
style/components/living-site.css
style/components/visual-decorations.css
```

主要页面：

```text
index.html

pages/
├── portfolio.html
├── game.html
├── blog.html
├── blog/*
├── journal.html
├── development.html
├── engineering.html
├── framework.html
├── framework-quickstart.html
├── framework-engineering.html
├── framework/*
├── tools.html
├── mods.html
├── wisteria.html
├── now.html
├── contact.html
├── brand.html
├── subscribe.html
└── ...
```

构建与验证：

```text
scripts/generate-site.mjs
scripts/build-personas-v2.py
scripts/verify-site.mjs
tests/browser-smoke.mjs
tests/brand-*.test.mjs
tests/blog-*.test.mjs
```

---

## 1.2 当前设计层问题

### A. Persona 已升级，Page Grammar 未升级

六个角色已经有完整 V2：

- Iris
- Sakura
- Myosotis
- Violet
- Freesia
- Wisteria

但大量页面仍然使用：

```text
Hero
↓
Section
↓
Card Grid
↓
Another Card Grid
↓
Footer
```

Persona 主要通过：

- 颜色；
- Hero 图；
- logo；
- motif；

表达差异。

这不足以支撑真正的六品牌识别。

---

### B. CSS 存在历史叠加

例如 Blog 仍保留旧深色规则：

```css
.blog-prose {
    color: #e6e1ea;
}

.blog-prose pre {
    background: #090909;
}
```

然后又在 `iris-sakura.css` 重新覆盖成浅色。

这说明当前系统是：

> 旧页面样式 → 品牌覆盖 → Persona 覆盖 → 页面例外修补

而不是：

> Token → Shell → Component → Persona → Page

本轮必须停止继续堆覆盖。

---

### C. Myosotis 系列断层

当前：

```text
journal.html
```

已经较像正式的 Myosotis Knowledge / Research 环境。

当前 `blog.html`、正式 Article、Series、Tag 已使用 `journal` 品牌模式，属于 Myosotis；`subscribe.html` 仍使用 `master` 模式。

尚未统一的是页面结构与阅读体验：

```text
Journal / Archive
→ Blog / Publication
→ Series / Reading Order
→ Tag / Index
→ Article Reader
→ Subscribe
```

本轮需要形成连续的 Archive → Publication → Reading System，并将 Subscribe 接入 Myosotis 的极简出版界面，而不是重新宣称 Blog 尚未归属 Myosotis。

因此用户从 `journal.html` 进入 Blog 后会明显感到进入另一代页面。

---

### D. 六项目配置层级不完全一致

当前 `config/site-presentation.json` 的核心 `projects` 列表主要将：

- Iris
- Sakura
- Myosotis
- Violet

作为正式 Project entry。

而 Freesia 与 Wisteria 在部分位置通过额外链接 / 页面补充进入。

但从 Six Personas V2 的品牌逻辑来看，六者应该都是正式一等项目身份。

本轮应建立**统一六个品牌项目入口的 registry**，并保留独立的作品 / Mod / 实验数据及既有稳定技术 ID。

---

### E. 自动测试更偏“没有坏”，而非“设计成立”

现有测试已经覆盖：

- overflow；
- contrast；
- 路由；
- card count；
- responsive；
- 部分 Persona layout。

但网站视觉翻新还需要新增：

- Page Grammar Test；
- Hero hierarchy test；
- article reading width；
- persona layout differentiation；
- breakpoint screenshot baseline；
- deep-page family consistency。

---

# 2. 本轮设计目标

## 2.1 目标不是“更花”

本轮不追求：

- 更多装饰；
- 更多人物；
- 更多渐变；
- 更多动画。

追求：

1. 页面结构表达项目身份；
2. 六项目视觉差异不依赖颜色；
3. 用户从浅层进入深层时视觉语言不断裂；
4. 文章阅读体验优先于品牌展示；
5. 作品页面由作品本身主导；
6. 工程页面由信息结构主导；
7. Wisteria 保持空间和生活世界感；
8. 整站仍明显属于同一个 IrisSakura。

---

# 3. 全站统一设计系统

## 3.1 必须统一的内容

所有页面共享：

### Navigation
- Navbar 高度；
- 导航 active 规则；
- Logo / wordmark；
- Mobile navigation；
- Breadcrumb 基础行为。

### Footer
- 信息结构；
- 字号与 spacing；
- 项目入口；
- 社交链接；
- 动效开关。

### Typography
建议建立稳定层级：

```text
Display XL
Display L
H1
H2
H3
Lead
Body
Small
Meta
Code
```

不允许页面自行定义新的字号系统。

### Layout
统一：

```text
--page-gutter
--container-wide
--container-standard
--container-reading
--container-breakout
--section-space
--section-space-compact
```

### Interaction
统一：

- Button
- Link
- Card hover
- Focus visible
- Tag
- Disclosure
- TOC
- Tabs
- Status

### Motion
统一：

- duration；
- easing；
- reduced-motion；
- hover lift 上限；
- decorative ambient animation 强度。

---

# 4. 建议 CSS 架构

本轮应逐步收敛为明确的层：

```css
@layer reset, tokens, base, shell, components, personas, pages, utilities;
```

## 4.1 reset
只做 normalize / reset。

## 4.2 tokens
只允许变量：

```text
color
spacing
type
radius
shadow
motion
layout
persona
```

## 4.3 base
只负责：

```text
body
heading
paragraph
link
media
selection
code basics
```

## 4.4 shell

```text
navbar
footer
container
page-shell
section
grid
breadcrumb
```

## 4.5 components

```text
button
card
tag
toc
article
media-frame
status
table
code-block
callout
timeline
drawer
shelf
graph-node
```

## 4.6 personas
只定义人格语义变量和可复用 motif：

```text
[data-persona="iris"]
[data-persona="sakura"]
[data-persona="myosotis"]
[data-persona="violet"]
[data-persona="freesia"]
[data-persona="wisteria"]
```

**Persona 层不得定义整个页面 layout。**

## 4.7 pages
页面语法：

```text
home
portfolio
game
development
engineering
framework
journal
blog
article
tools
mods
wisteria
brand
about
now
subscribe
404
```

---

# 5. 六 Persona 正式 Page Grammar

---

# 5.1 Iris Engineering

## 核心感觉

> 被组织好的工程系统。

## 空间语法

```text
Grid
Axis
Structure
Control
Evidence
Status
```

## Hero

Desktop：

```text
┌──────────────────────────────────────────────┐
│ IRIS ENGINEERING            [Iris / System] │
│ Engineer · Manage · Deliver                 │
│                                             │
│ 系统说明                                     │
│ [Workflow] [Capabilities]                   │
└──────────────────────────────────────────────┘
```

右侧不能只有角色图。

应该是：

```text
Iris
+
System Grid
+
Current State
+
Engineering Motif
```

## 下层 Section

优先：

- capability matrix；
- evidence chain；
- workflow；
- delivery state；
- structure map；
- status board。

减少：

- 普通三列 feature card。

## 独有组件

```text
EngineeringGrid
SystemAxis
EvidenceChain
CapabilityMatrix
StatusRail
```

## 禁止

- 赛博朋克 HUD；
- 居家工作台；
- 过量漂浮面板；
- 和 Violet 同样的工具列表结构。

---

# 5.2 SakuraGameFramework

## 核心感觉

> 框架在生长、组合、展开。

## 空间语法

```text
Branch
Node
Flow
Module
Expansion
Growth
```

## Hero

```text
                Gameplay
                  │
Asset ─── Kernel ─┼── UI
                  │
              Services
```

Sakura 角色位于结构一侧，而不是压住结构。

## Module 展示

不再只是：

```text
[Module][Module][Module]
```

而要表达：

```text
Core
 ├ Runtime
 ├ Gameplay
 ├ UI
 ├ Data
 ├ Networking
 └ Tooling
```

## 独有组件

```text
ModuleBranch
FrameworkNode
AdoptionPath
GrowthMap
DependencyFlow
```

## Quickstart

应该明显像：

> 从 Seed → Root → Branch → Working Project

而不是普通教程卡。

---

# 5.3 Myosotis

Myosotis 是：

> Knowledge / Research / Writing Environment

而不是单独的 Journal page theme。

正式结构：

```text
Myosotis
├── Journal / Archive
├── Blog / Publication
├── Series
├── Tags
├── Article Reader
└── Subscribe
```

---

## 5.3.1 Journal

核心感觉：

> 档案馆。

页面结构：

```text
Archive Hero
Search
Collections
Knowledge Streams
Recent Findings
Research Library
Cross-links
```

可以保留已有优势，但进一步强化：

- Archive index；
- open book；
- record metadata；
- knowledge connection。

---

## 5.3.2 Blog Index

Blog 应从 Card Grid 转成“正式出版区”。

推荐：

```text
WRITING
Featured Essay

────────────

Latest Publications

2026.09
│
├── Article
├── Article
└── Article

2026.08
│
├── Article
└── Article
```

卡片可以存在，但只用于：

- Featured；
- Series；
- Publication collection。

不要所有文章都是等价 Card。

---

## 5.3.3 Series Page

不要普通 Collection Hero + Grid。

推荐：

```text
SERIES

游戏系统的共同语言
Volume 01

About

Reading Order
01 ─ Authoritative Time
02 ─ ...
03 ─ ...

Related Knowledge
```

阅读顺序是第一等信息。

---

## 5.3.4 Tag Page

Tag 是索引，不是 Series。

结构：

```text
TAG · UNITY

Intro
Result count
Filter context
Chronological list
Related tags
```

不要伪装成 Series。

---

## 5.3.5 Article Reader

这是本轮必须重点重做的界面。

### Desktop

```text
┌────────────┬──────────────────────┬────────────┐
│ TOC        │ ARTICLE              │ CONTEXT    │
│            │ 680~760 px           │ Series     │
│            │                      │ Tags       │
│            │                      │ Related    │
└────────────┴──────────────────────┴────────────┘
```

建议：

```text
Article shell: 1180~1280 px
Article text: 680~760 px
Breakout: 900~1100 px
```

正文不要以 920px 纯文字宽度直接排版。

### Breakout 内容

正文、侧栏和宽内容必须具有明确的网格占位关系。宽内容使用专用跨列行，或在空间不足时收起 / 下移相关侧栏；不得以负边距或绝对定位覆盖目录、上下文或正文。900–1100px 是桌面可用空间足够时的目标上限，不是强制最小宽度。

以下允许超出正文：

- Table；
- Code；
- Diagram；
- Screenshot；
- Comparison；
- Timeline。

### Mobile

```text
Breadcrumb
Title
Metadata
Deck
Tags

[TOC disclosure]

Article

Related
```

右侧 Context 不保留。

### 阅读组件

新增：

```text
ArticleToc
ArticleMeta
ArticleBreakout
ArticleCallout
ArticleFigure
ArticleCode
ArticleTable
SeriesContext
ReadingProgress (可选)
```

### 禁止

- 人物全身图长期固定在正文旁；
- 飘花覆盖正文；
- decorative particle 穿过阅读区；
- 角色素材影响长文滚动性能。

---

# 5.4 Violet Shelf

## 核心感觉

> 一张真的可以工作的个人工具桌。

## 空间语法

```text
Shelf
Desk
Drawer
Tray
Tool Bag
Notebook
```

## Hero

Violet 可以坐在工作台附近。

页面主要空间应该表现：

```text
Available Tools
Recent Tools
Installed
Experimental
Collections
```

以上是候选信息分组，不代表网站能读取用户本地安装状态。`Installed` 仅在存在真实、明确的状态来源时使用；否则改为有证据的项目状态或不展示。

## Tool list

推荐：

```text
SHELF

Numerical Lab       Ready
Asset Tool          Ready
Config Tool         Prototype
...
```

可以设计：

- Drawer；
- Shelf row；
- Notebook；
- Utility tray。

工具名称、可用性、版本与状态必须来自现有公开资料。上面的 Numerical Lab、Asset Tool、Config Tool 和 Ready / Prototype 都是排版示例，不得直接转为事实文案或虚构入口。

## 独有组件

```text
ToolShelf
ToolDrawer
ToolTray
WorkbenchPanel
UtilityStatus
```

## 禁止

- Iris 式系统控制台；
- 全屏科技 HUD；
- 大量蓝色工程感；
- Tool 每个都做成 SaaS feature card。

---

# 5.5 Freesia Mods

## 核心感觉

> 可以随便点进去探索的新可能性。

## 空间语法

```text
Route
Card
Discovery
Branch
Sticker
Collection
```

## Hero

开放、明亮、非对称。

Freesia 的主视觉可以保留伸手 / 邀请感。

## Mod discovery

推荐：

```text
DISCOVER

Slay the Spire 2
├── Iris Core
└── The Weaver

Other Games
├── ...
└── ...
```

状态可以是：

```text
Building
Exploring
Playing With
Archived
```

分组、状态与入口以 `config/mod-series.json`、现有作品数据和公开资料为准。Iris Core、The Weaver 保持独立作品身份；Other Games 仅在有真实内容时出现。

## 独有组件

```text
ModRoute
DiscoveryCard
GameCluster
ExperimentTag
ModStatus
```

## 允许

- 轻微旋转；
- Sticker；
- 斜卡；
- 跳色；
- 多层卡片。

## 禁止

- Pinterest 级杂乱；
- 不规则到影响阅读；
- 过度 motion；
- 把页面做成营销商城。

---

# 5.6 Wisteria

## 核心感觉

> 一个即使离开也仍持续存在的小世界。

## 空间语法

```text
Space
Layer
Depth
Continuity
Window
Boundary
World
```

## Hero

Wisteria 不应该像 SaaS 项目首页。

推荐：

```text
A Living World

[大空间视觉]

世界仍然在这里。

↓
What lives here
↓
A day in Wisteria
↓
Window Spirits
↓
Pet / Weather / Music
↓
How the world grows
```

以上是体验叙事建议，不是已实现功能清单。Window Spirits、Pet、Weather、Music、持续运行与持久化等内容，只有在有当前项目证据和可公开素材时才能描述为已实现；尚未实现的方向应清楚表述为探索目标。保留真实制作状态，不虚构下载或体验入口。大空间视觉还需核对素材尺寸与用途，不把低分辨率切片放大成已完成产品截图。

## 空间

允许：

- 大留白；
- 前景；
- 中景；
- 背景；
- 植物下垂；
- 灯；
- 窗；
- 拱；
- 环境层次。

## 技术内容

移到后部：

```text
Development Notes
Technical Architecture
Platform
Rendering
Persistence
```

不要首屏上来就是 Feature / Architecture / Roadmap。

## 独有组件

```text
WorldLayer
SceneWindow
ContinuitySection
LivingMoment
WorldNote
```

---

# 6. 公共页面设计

---

# 6.1 Home

当前首页 Section 顺序已经较清楚，但仍偏独立模块堆叠。

V2 建议围绕：

> “我正在构建什么”

重组叙事。

推荐：

```text
1. Identity
2. Now
3. Play
4. Build
5. Think
6. Explore
7. Live
8. Timeline / Updates
9. About
```

映射：

```text
PLAY    → Games / Portfolio
BUILD   → Iris / Sakura / Violet
THINK   → Myosotis / Writing
EXPLORE → Freesia
LIVE    → Wisteria
```

## Home Persona 使用原则

角色不能六张等大卡一次性塞满首页。

首页应优先表现“项目角色关系”，而不是“角色图库”。

---

# 6.2 Development Hub

`development.html` 正式定义为：

> **Ecosystem Map**

六项目全部成为一等入口。

每个项目展示：

```text
Project
Role
Owns
Produces
Connects To
Current Status
Enter
```

不要只做六个等权 Card。

推荐有清晰关系图 / system map。

---

# 6.3 Portfolio

定位：

> 我实际做出来了什么。

主角是：

- 游戏；
- Demo；
- Prototype；
- Video；
- Screenshot；
- Result。

Persona 只作为：

```text
Built with
Supported by
Part of ecosystem
```

的辅助标记。

不允许角色压过作品截图。

---

# 6.4 Game Detail

Game 页面应该是消费型内容表达，不套项目工具页。

优先：

```text
Hero Screenshot / Video
What the player does
Core Loop
Systems
Current Build
What I did
Evidence / Screenshots
Status
```

Persona 只在底部显示关联生态。

---

# 6.5 Now

定位：

> 当前状态。

简洁、真实、少装饰。

推荐：

```text
NOW
22 Sep 2026

Building
Studying
Reviewing
Playing
```

不要 Persona Hero。

---

# 6.6 About / Contact

主角必须是用户本人。

六花承担：

> 六个长期方向 / 项目身份。

但不能替代本人。

---

# 6.7 Brand

这是角色浓度最高的页面。

正式定义：

> IrisSakura Visual System

内容：

```text
Master Brand
Six Personas
Project Mapping
Logos
Palette
Motifs
Silhouette
Page Grammar
Current Visual Language
Asset Usage
Do / Don't
```

只展示已审核、适合公开的当前设定图与视觉用法；含有旧标识、错误文字或维护信息的设定稿不能直接上线。V1 → V2 迁移过程、来源审计、内部素材编号和验收记录留在仓库维护文档，不进入公开页面、alt、元数据或分享文案。

---

# 6.8 Subscribe

Subscribe 属于 Myosotis Publication System，但应该极简。

```text
Subscribe
Feed URL
Copy
RSS reader guide
What gets published
```

不要大面积角色图。

---

# 6.9 404

404 可做成共享品牌页面。

建议不绑定某一个 Persona。

使用：

- Master logo；
- 六花 motif 少量；
- 简单导航；
- 回首页；
- 搜索 / Projects / Writing。

---

# 7. 六项目 Registry 重构

建议将 `config/site-presentation.json` 的品牌项目展示层统一为六个正式入口，并同步渲染器、契约与相关测试。这里的 Project Registry 是品牌项目目录，不是全部作品数据库。

当前不要再出现：

```text
4 个核心 project
+
Freesia link
+
Wisteria link
```

改成：

```text
projects: [
  irisEngineering,
  sakuraFramework,
  myosotis,
  violetShelf,
  freesiaMods,
  wisteria
]
```

上面的名称仅表示六个条目，不是新的技术 ID。保留已有 `iris-engineering`、`sakura-framework`、`sakura-design-journal`、`iris-shelf`，并沿用当前六角色映射中的 `freesia-mods`、`wisteria`。不修改仓库名、Bundle ID、已有路由或导入协议身份。

每个正式具备：

```text
projectId
personaId
displayName
route
navigationGroup
subtitle
summary
logoAssetKey
heroAssetKey
order
primaryAction
secondaryAction
status
relationships
```

`data/projects.json` 继续承载实际项目、作品、Mod 与实验的事实来源；不得强行缩成六项，也不得用六品牌目录覆盖已有数据。Freesia 与旗下作品通过关系连接，Wisteria 不因新增品牌入口就被描述为已交付产品。

状态与关系应引用已有权威数据；缺少事实来源时明确记录未提供，不填写示例状态。渲染契约必须允许品牌入口与作品条目不是一对一关系。

---

# 8. Persona Registry 与 Page Registry 分离

`config/personas-v2.json` 管：

```text
视觉身份
颜色
资产
文案
motif
```

新的 / 重构后的页面配置负责：

```text
页面类型
layout grammar
content source
navigation
section order
```

不要让 Persona config 承担页面结构。

---

# 9. 推荐新增 Page Family 概念

建议所有页面归类：

```text
global
personal
portfolio
editorial
project
product
utility
brand
```

例如：

```text
blog article → editorial
engineering → project
framework → project
tools → project
mods → project
wisteria → project
game → product
portfolio → portfolio
now → personal
contact → personal
brand → brand
```

这样 Component / CSS 可以按 Family 复用。

---

# 10. 响应式规范

必须覆盖至少：

```text
2048
1600
1440
1280
992
900
769
600
390
```

## Desktop

允许：

- 三栏 Article；
- 双列 Hero；
- Persona 与结构并列；
- 大空间 Composition。

## Tablet

重点避免：

- Copy / Art overlap；
- 角色遮挡按钮；
- panel 强行保持两列；
- 横向 overflow。

## Mobile

规则：

1. Content 第一；
2. Persona 图后置；
3. 大角色图高度受控；
4. Side rail → disclosure；
5. 多列 → 单列；
6. Table 可横向滚动；
7. Code 不扩大 viewport；
8. decorative layer 减少。

---

# 11. Character Asset 使用规范

## Hero

允许：

- Transparent character；
- Scene；
- Motif；
- Character + motif。

禁止：

- 完整角色设定 Sheet 直接作为页面 Hero。

## Section

优先：

- Motif；
- props；
- scene；
- detail。

而不是重复全身角色。

## Card

角色只在非常必要时出现。

小卡优先：

```text
Logo
Flower
Motif
Scene detail
```

## Icon

< 64px：

不要人物。

用 Logo / flower / motif。

---

# 12. 视觉密度规则

页面分三种密度：

## Reading
低装饰：

- Article；
- Subscribe；
- Long docs。

## Working
中等密度：

- Iris；
- Violet；
- Framework Engineering。

## Experiential
高视觉：

- Home Hero；
- Freesia；
- Wisteria；
- Brand。

Persona art intensity 不得全站相同。

---

# 13. Motion 规范

## 全局

默认：

```text
150–300ms
```

允许：

- hover；
- subtle translate；
- opacity；
- small scale；
- ambient slow motion。

禁止：

- 内容位移影响阅读；
- scroll-jacking；
- excessive parallax；
- article 正文飘花；
- cursor-following decorative effects。

## Persona

Iris：
- 轻、精确。

Sakura：
- flow / grow。

Myosotis：
- page / fade。

Violet：
- drawer / slide。

Freesia：
- small playful tilt。

Wisteria：
- slow drift / depth。

---

# 14. Article Reading System 具体规范

## 字体与宽度

```text
Body: 16–18px
Line-height: 1.75–1.9
Text width: 680–760px
```

## Heading

H2：
- 明确 section；
- margin-top 足够。

H3：
- subordinate；
- 不与 H2 视觉接近。

## Paragraph

桌面中文正文以 680–760px、16–18px 字号为起点，通常约每行 38–47 个全角汉字；具体受字体、标点和中英文混排影响。75–85 个字符不作为中文行宽指标。最终以实际字体下的行宽、阅读节奏与连续阅读检查为准；移动端随可用宽度收缩。

## Code

```text
max-width: breakout
overflow-x: auto
line-height: 1.6
```

## Table

Desktop：
- breakout。

Mobile：
- horizontal scroll；
- sticky optional。

## Blockquote

使用 Myosotis 风格：

- paper / margin；
- blue / gold small accent。

不要粉色大框。

---

# 15. 页面级 Component Mapping

| 页面 | 核心组件 |
|---|---|
| Home | IdentityHero, NowFeed, WorkFeature, EcosystemBridge |
| Portfolio | WorkHero, WorkCard, EvidenceMedia |
| Game | GameHero, LoopMap, SystemSection |
| Development | EcosystemMap, ProjectRoute |
| Iris | SystemGrid, EvidenceChain, CapabilityMatrix |
| Sakura | ModuleBranch, GrowthMap, AdoptionPath |
| Myosotis | ArchiveSearch, KnowledgeStream |
| Blog | PublicationHero, PublicationTimeline |
| Article | ArticleShell, ArticleToc, SeriesContext |
| Violet | ToolShelf, ToolDrawer |
| Freesia | ModRoute, DiscoveryCard |
| Wisteria | WorldLayer, SceneWindow |
| Brand | PersonaShowcase, PaletteSystem, GrammarComparison |
| Now | CurrentStateList |
| Contact | PersonalProfile, ContactRoutes |
| Subscribe | FeedBox, SubscriptionGuide |

---

# 16. 禁止事项

本轮 Agent 禁止：

1. 一边改一边随意发明设计；
2. 每个页面独立重做而不遵循统一系统；
3. 只换颜色称为页面特色；
4. 六页都继续 Card Grid；
5. 把角色图当背景图到处铺；
6. Wisteria 改成科技蓝紫；
7. Violet 再次和 Iris 同构；
8. Myosotis Article 加过多装饰；
9. Portfolio 让 Persona 抢走作品主体；
10. 全站继续追加覆盖 CSS；
11. 保留明显未使用旧 CSS；
12. 在页面 HTML 中散落色值；
13. 为桌面布局牺牲移动端；
14. 只测 overflow，不测视觉层级；
15. 每完成一个 section 就停下来验收。

---

# 17. 实施阶段

遵循用户既定原则：

> **设计先行、连续实施、完整功能闭环后集中验收。**

---

# Phase 0 — Baseline Freeze

不要改代码。

记录：

```text
current main SHA
screenshots
route inventory
CSS inventory
persona asset inventory
```

产出：

```text
WEBSITE_V2_BASELINE.md
```

---

# Phase 1 — 全站页面建模

扫描所有公开页面。

建立：

```text
route
family
persona
content role
current layout
target grammar
shared components
unique components
```

产出：

```text
WEBSITE_V2_PAGE_MATRIX.md
```

---

# Phase 2 — CSS / Component 架构设计

只设计：

```text
layer
token
shell
component
persona
page
```

并列出：

```text
keep
move
merge
delete
deprecate
```

产出：

```text
WEBSITE_V2_STYLE_ARCHITECTURE.md
```

---

# Phase 3 — 六个 Reference Pages

先完整实现：

```text
engineering.html
framework.html
journal.html
tools.html
mods.html
wisteria.html
```

要求：

> 六页能够明显体现六种 Grammar。

六页形成完整候选后，进行一次内部结构复核：检查页面结构是否符合已确定的设计，以及隐藏人物后是否仍有明确差异。发现偏差在本次批准边界内连续修正，通过后继续公共页与深层页面。

这不是单独交付批次或新增人工批准点，也不要求逐页面运行全套测试。只有目标、关键契约、权限或核心前提发生实质变化时，才重新确认。最终技术与视觉验收仍集中在完整版本形成后进行。

---

# Phase 4 — Global Pages

连续完成：

```text
index
development
portfolio
game
now
contact
brand
subscribe
404
```

---

# Phase 5 — Deep Families

## Myosotis

```text
blog
articles
series
tags
subscribe
```

## Sakura

```text
framework
quickstart
framework-engineering
framework/*
```

## Freesia

当前只有 `pages/mods.html`，尚不存在 `pages/mods/*` 深层路由。先完善现有发现入口与真实作品链接；只有页面矩阵确认有独立内容、事实来源和实际用途时才新增深层页面，不为满足目录示例创建空页面。

## 其他

按实际路由继续。

---

# Phase 6 — Cleanup

删除 / 合并：

- obsolete CSS；
- old Persona overrides；
- duplicated selectors；
- unused assets；
- retired V1 references。

旧视觉资源归档，不直接删除历史。

---

# Phase 7 — Full Validation

仅在全部功能闭环后进行。

---

# 18. 测试要求

## 18.1 Existing Tests

必须继续通过：

```bash
npm run check
```

或仓库实际完整验证命令。

保留路由、内容真实性、SEO、可访问性和交互回归要求。对于被本次设计明确替代的结构断言，例如固定四项目、旧色板或统一卡片模板，应依据新的明确契约更新期望，不能为了通过旧断言恢复已淘汰布局；也不能删除有效断言或降低验收标准。

---

## 18.2 新增 Browser Smoke

至少增加：

### Article

检测：

```text
text width
toc visibility
breakout width
table overflow
mobile collapse
```

### Persona Pages

检测：

```text
hero structure
no overlap
unique grammar marker
correct persona
```

### All routes

继续：

```text
no horizontal overflow
no broken asset
no undefined
no private path
```

---

# 19. 新增视觉验收测试

---

## A. Page Silhouette Test

截图后：

- 灰度；
- 去文字；
- 降细节。

确认六项目仍有结构差异。

---

## B. Blur Test

高斯模糊。

确认：

- 页面主要色块不全部相同；
- Hero / content / secondary 层级仍成立。

---

## C. Content-Off Test

隐藏：

```text
h1
project name
logo
```

确认项目仍可大致识别。

---

## D. Persona-Off Test

隐藏角色本人。

确认：

> 页面仍然具有该项目设计语言。

这是非常关键的测试。

如果隐藏角色后 Iris / Sakura / Violet 全部变成相同 Card Grid，则失败。

---

## E. Reading Test

文章连续阅读 10–15 分钟。

检查：

- 行宽；
- 对比；
- heading rhythm；
- code；
- table；
- link；
- fatigue。

---

# 20. Accessibility

必须保留：

- Semantic HTML；
- aria；
- skip link；
- focus visible；
- reduced motion；
- contrast；
- keyboard nav；
- alt text。

装饰图片：

```html
alt=""
aria-hidden="true"
```

人物具有语义时才写 alt。

---

# 21. Performance

## 图片

Master：
- PNG。

Web：

```text
AVIF
WebP
```

必须：

- width / height；
- responsive srcset；
- correct sizes；
- lazy loading（非首屏）；
- preload 仅首屏必要图。

## 禁止

- 多张 1MB+ Persona 同屏加载；
- Article 页面加载无关角色大图；
- Mobile 下载 desktop-only 超大图。

---

# 22. SEO / Social

翻新不能破坏：

- canonical；
- title；
- description；
- OpenGraph；
- Twitter card；
- JSON-LD；
- sitemap；
- RSS。

Blog Article 的 Article schema 必须继续存在。

---

# 23. 文案原则

## 项目

文案要回答：

```text
它是什么？
为什么存在？
能做什么？
现在做到哪？
怎样进入？
```

## Persona

不是 OC 设定介绍。

不要写：

> 她喜欢什么、性格多可爱。

除非 Brand 页面。

项目页上的 Persona 只承担：

> Project Identity。

---

# 24. 最终文件结构建议

可逐步迁移到：

```text
style/
├── tokens/
│   ├── primitive.css
│   ├── semantic.css
│   ├── layout.css
│   ├── typography.css
│   └── personas-v2.css
├── shell/
│   ├── navbar.css
│   ├── footer.css
│   ├── container.css
│   └── page-shell.css
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── article.css
│   ├── toc.css
│   ├── media.css
│   ├── persona.css
│   └── ...
├── personas/
│   ├── iris.css
│   ├── sakura.css
│   ├── myosotis.css
│   ├── violet.css
│   ├── freesia.css
│   └── wisteria.css
└── pages/
    ├── home.css
    ├── portfolio.css
    ├── blog.css
    ├── engineering.css
    ├── framework.css
    ├── journal.css
    ├── tools.css
    ├── mods.css
    └── wisteria.css
```

不要求一次机械拆文件，但最终职责必须接近该结构。

---

# 25. Agent 最终交付物

必须输出：

```text
WEBSITE_V2_BASELINE.md
WEBSITE_V2_PAGE_MATRIX.md
WEBSITE_V2_STYLE_ARCHITECTURE.md
WEBSITE_V2_IMPLEMENTATION_REPORT.md
WEBSITE_V2_VISUAL_ACCEPTANCE.md
WEBSITE_V2_TECHNICAL_ACCEPTANCE.md
```

并附：

- 修改文件清单；
- 删除 / 合并 CSS 清单；
- 资产变化；
- 新组件；
- 新测试；
- 所有路由截图；
- Desktop / Tablet / Mobile；
- known issues；
- residual V1 references。

---

# 26. 完成标准

只有以下全部满足才可称为完成。

## Global

- [ ] Navbar / Footer 一致
- [ ] 全站 typography 统一
- [ ] spacing system 统一
- [ ] 没有明显 CSS layering debt 新增
- [ ] 六品牌项目入口 registry 一致，作品 / Mod / 实验数据独立保留，稳定技术 ID 不变

## Six Personas

- [ ] Iris 有结构 / Grid 语法
- [ ] Sakura 有 Branch / Flow 语法
- [ ] Myosotis 有 Archive / Page 语法
- [ ] Violet 有 Shelf / Workbench 语法
- [ ] Freesia 有 Discovery / Route 语法
- [ ] Wisteria 有 Space / Layer 语法

## Deep Pages

- [ ] Blog 属于 Myosotis
- [ ] Article 属于 Myosotis
- [ ] Series 属于 Myosotis
- [ ] Tag 属于 Myosotis
- [ ] Framework deep pages 仍属于 Sakura
- [ ] 如有基于真实内容新增的 Mods 深层页，仍属于 Freesia；没有深层路由不构成缺失

## Responsive

- [ ] 2048
- [ ] 1600
- [ ] 1440
- [ ] 1280
- [ ] 992
- [ ] 900
- [ ] 769
- [ ] 600
- [ ] 390

无水平溢出与严重布局错误。

## Technical

- [ ] `npm run check` 通过
- [ ] smoke test 通过
- [ ] brand tests 通过
- [ ] blog tests 通过
- [ ] no broken URLs
- [ ] no stale V1 public references

---

# 27. Agent 可直接执行 Prompt

```text
你现在需要对 IrisSakura 个人网站执行一次完整的 Website V2 全站视觉与页面架构翻新。

本次工作不是局部修复，也不是只替换角色图。Six Flower Personas V2 已经定稿并完成素材迁移；现在需要让整个网站的页面结构、设计系统、深层页面和响应式体验真正与 V2 对齐。

核心目标：

One Site · Six Visual Languages

统一：
- Navbar
- Footer
- Typography
- Spacing
- Container
- Component semantics
- Accessibility
- Responsive behavior
- Motion
- Design tokens

六种页面语法：
- Iris → Grid / Axis / Structure
- Sakura → Branch / Flow / Expansion
- Myosotis → Page / Archive / Connection
- Violet → Shelf / Desk / Drawer
- Freesia → Route / Card / Discovery
- Wisteria → Space / Layer / Continuity

关键要求：

1. 不要边改边自由发挥。
2. 先调查与建模，不修改代码。
3. 先建立全站 Route / Page Family / Persona / Target Grammar Matrix。
4. 先设计 CSS Layer 与 Component Architecture。
5. 然后一次性完整实现六个 reference pages：
   - engineering.html
   - framework.html
   - journal.html
   - tools.html
   - mods.html
   - wisteria.html
6. 六页形成完整候选后做一次内部结构复核，在已批准边界内修正偏差，再连续完成 Home、Development、Portfolio、Game、Blog、Article、Series、Tag、Now、About、Brand、Subscribe、404 与实际存在或经页面矩阵确认的深层页面。这不是新增人工批准点，不逐页面运行全套验收。
7. 不要只依赖 Persona 颜色制造差异；隐藏人物和颜色后，六项目页面仍必须保有不同的结构语法。
8. Myosotis 必须形成完整系统：
   Journal / Archive → Blog / Publication → Series → Tag → Article Reader → Subscribe。
9. Article Reader 需要重新设计：
   - Desktop 正文约 680–760px
   - Page shell 可约 1180–1280px
   - Table / Code / Diagram 可 breakout 到 900–1100px
   - TOC 和 Series Context 在 Desktop 可侧栏化
   - Mobile 收敛成单栏 + 折叠 TOC
10. Violet 不得重新变成 Iris 的紫色变体。
11. Wisteria 不得改成科技蓝紫；必须保持空间、世界、低饱和与持续生活感。
12. Portfolio 页面以实际作品为主角，Persona 只能辅助。
13. About / Now 保持以本人和真实状态为主，不要过度角色化。
14. Brand 页面可以成为六角色视觉系统的完整展览馆。
15. 逐步清理旧 CSS，不继续新增“旧规则 + 新覆盖”的 layering debt。
16. 建议收敛为：
   reset → tokens → base → shell → components → personas → pages → utilities。
17. 所有图片使用 responsive AVIF/WebP，保留 PNG master。
18. 必须通过 npm / browser smoke / brand / blog 验证；保留有效回归与安全断言，将固定四项目、旧色板、旧模板等已被本次设计替代的结构期望更新为新契约。
19. 新增视觉与布局测试，包括：
   - Page Silhouette
   - Blur
   - Content-Off
   - Persona-Off
   - Reading Test
20. 完整技术与视觉验收在全部功能闭环后集中进行；六 Reference Pages 只做一次必要的内部结构复核，不要每改一个 Section 就停下来要求确认。
21. 六品牌项目目录与作品 / Mod / 实验数据分离，保留既有稳定技术 ID、事实来源和有效路由。
22. 示例工具、Installed、Wisteria 场景与功能、Mods 深层页均不能直接当作已实现事实；只使用经核对的公开内容，不创建空页面或假入口。
23. GitHub 是本站源仓库，遵守本仓库 AGENTS.md；公开 Brand 页展示当前视觉系统，迁移、来源审计与验收记录保留在维护文档。
24. 中文正文以 680–760px 与实际阅读效果为准，不要求每行 75–85 个汉字；Breakout 必须有独立占位或侧栏退让，不能覆盖阅读内容。

执行阶段：

Phase 0 — Baseline Freeze
Phase 1 — Full Page Modeling
Phase 2 — Style / Component Architecture
Phase 3 — Six Reference Pages
Phase 4 — Global Pages
Phase 5 — Deep Page Families
Phase 6 — CSS / Asset Cleanup
Phase 7 — Full Validation

最终必须交付：
- WEBSITE_V2_BASELINE.md
- WEBSITE_V2_PAGE_MATRIX.md
- WEBSITE_V2_STYLE_ARCHITECTURE.md
- WEBSITE_V2_IMPLEMENTATION_REPORT.md
- WEBSITE_V2_VISUAL_ACCEPTANCE.md
- WEBSITE_V2_TECHNICAL_ACCEPTANCE.md

最终完成标准不是“每个页面都变漂亮”，而是：
- 整站明显属于 IrisSakura；
- 六项目各有明确页面语法；
- 深层页面不会回退到旧视觉；
- 阅读、作品、工程、工具、Mod、持续世界各自适合自己的内容；
- Responsive / Accessibility / Performance / SEO 全部保持稳定；
- 不再依赖不断覆盖旧 CSS 来维持视觉。
```

---

# 28. 最终判断原则

本轮任何视觉决策都用以下顺序判断：

```text
1. 这个页面的内容目的是什么？
2. 用户真正要完成什么？
3. 页面属于哪个 Family？
4. 是否绑定 Persona？
5. 这个 Persona 的空间语法是什么？
6. 哪些是统一系统，哪些允许特殊？
7. Desktop / Tablet / Mobile 如何退化？
8. 隐藏 Persona 图以后页面是否仍成立？
9. 去色以后是否仍有辨识度？
10. 是否值得增加复杂度？
```

如果一个设计只因为：

> “看起来更有 Persona 感”

却降低：

- 可读性；
- 操作效率；
- 内容理解；
- 响应式稳定性；
- 性能；

则不采用。

---

# 29. 本轮真正的目标

最终网站不应该给人感觉：

> 六个角色被贴在同一个模板网站里。

而应该是：

### Iris
像工程系统。

### Sakura
像生长中的框架。

### Myosotis
像可以长期阅读和追踪的知识档案馆。

### Violet
像真正能拿工具工作的创作桌面。

### Freesia
像一片可以自由探索 Mod 与想法的区域。

### Wisteria
像一个仍在缓慢生活的持续世界。

但用户无论在哪，都能明确感受到：

> **这是 IrisSakura 的同一个网站。**
