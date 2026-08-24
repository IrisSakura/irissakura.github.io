# IrisSakura 个人站

这是 IrisSakura 的公开个人品牌站。品牌体系以两个职责清晰的支柱组织：IRIS 负责 Engineering / Project Management，SAKURA 负责 Game Framework；游戏消费项目暂不纳入这套命名家族。

站点内容继续围绕一条可验证的项目链组织：

> Sakura Design Journal（研究）→ Sakura Framework（工程沉淀）→《言铸之剑》（游戏验证）

站点不展示没有事实来源的技能百分比、虚构项目、模拟联系结果或私有仓库地址。

## 页面结构

- `/`：定位、能力证据、精选项目与研究更新；
- `/pages/journal.html`：一级“研究与文章”入口，包含策展研究、公开证据链与文章入口；
- `/pages/blog.html`：正式文章、系列与标签聚合的稳定独立地址；
- `/rss.xml`：只收录正式文章语义地址的 RSS 2.0 订阅；
- `/pages/framework.html`：框架规模、模块浏览器与生命周期成熟度；
- `/pages/framework-quickstart.html`：从 Core Only 到 Bootstrap Lite 的 15 分钟安装、事件、对象池、验证与清理教程；
- `/pages/game.html`：《言铸之剑》可玩原型案例；
- `/pages/portfolio.html`：三条真实项目主线，以及四个 Domain Consumer Lab 独立消费项目的本地验证矩阵；
- `/pages/art-music.html`：一级“美术音乐”入口，公开展示 IRIS × SAKURA 品牌系统、双人格视觉、色板、图标与命名规则；
- `/pages/contact.html`：工作邮箱、工作 QQ 与已验证的公开联系入口；
- `/pages/about.html`：旧 About 地址的 `noindex` 首页兼容跳转；
- `/404.html`：GitHub Pages 自定义错误页。

## 本地运行

```bash
npm ci
npm run build
python3 -m http.server 8000
```

打开 `http://localhost:8000/`。

## 构建与验证

```bash
npm run check
npm run test:smoke
npm run package:site
```

- `npm run generate`：从公共模板和 JSON 事实源生成导航、页脚、SEO、RSS、Sitemap、栏目/文章分享图与 Framework 静态回退；
- `npm run test:json`：直接扫描原始 JSON 文本，拒绝 `package.json`、`data/*.json` 和 `config/*.json` 的重复键与语法错误；
- `npm run build`：生成站点源文件并把 TypeScript 编译到 `dist/`；
- `npm test`：运行数据契约、内容真实性、链接、资源和 HTML 语义检查；
- `npm run test:smoke`：用无头 Chromium 检查主要路由、响应式留白、主题切换、文章出版、证据链与移动导航；
- `npm run package:site`：把发布所需文件复制到 `_site/`。

`dist/` 和 `_site/` 都是 CI 产物，不进入主分支。不要直接修改生成文件。

## 数据来源

- `data/site.json`：品牌定位和真实社交入口；
- `data/projects.json`：三个公开项目的状态、职责、证据与限制；
- `data/consumer-lab.json`：四个独立 Unity 消费项目的站点策展文案与 owner-only 技术快照；该文件用于生成校验，不进入 Pages artifact；
- `data/journal.json`：私有研究仓库的站内策展快照，不含仓库地址；
- `data/journal-source.json`：由 Journal 固定提交生成的公开摘要与博客清单；
- `content/blogs/`：通过安全导入并由 publication 合同选中的 Markdown 正文镜像；
- `config/blog-publication.json`：Journal 导入自动收敛的出版投影；既有条目保留站点侧状态、语义 slug 与首次发布日期，标题、摘要、系列、标签、更新日期和正文哈希跟随固定导出；
- `data/blog-taxonomy.json`：正式文章使用的系列与标签语义路由；既有策展文案保留，新 ASCII 标签由导入器确定性补齐；
- `data/evidence-chains.json`：研究、Framework 采用映射和游戏系统之间的公开证据链与边界；
- `data/framework.json`：由 Sakura Framework 权威清单生成的白名单公开快照；
- `data/framework-adoption.json`：经人工复核的 Supported 包、稳定路线和真实项目采用映射；
- `data/framework-quickstart.json`：只登记路线 ID 与教程步骤，包名从 adoption 注册表派生，不自行绑定版本。

框架同步和维护边界见 [`docs/maintenance/framework-sync.md`](docs/maintenance/framework-sync.md)。

### 栏目视觉与项目头图

主要分页视觉由 `data/site.json` 集中管理，不需要逐页修改 HTML。

1. `home`、`framework`、`journal`、`blog` 和 `contact` 默认使用纯 CSS 栏目视觉，`image` 保持空字符串；它们不会借用游戏截图。

2. `portfolio` 与 `game` 可以使用已有真实项目图片，并通过 `position` 设置焦点：

```json
{
  "portfolio": { "image": "assets/images/sword-of-words/room-selection.png", "position": "50% 46%" },
  "game": { "image": "assets/images/sword-of-words/combat-room.png", "position": "50% 48%" }
}
```

可配置键为 `home`、`portfolio`、`framework`、`journal`、`blog`、`game` 和 `contact`。`position` 的第一个百分比控制左右焦点，第二个控制上下焦点。

3. 运行 `npm run build`。构建会检查项目图片并重建页面，同时在 `assets/social/` 生成每个页面独立的 1200×630 PNG 分享图。不要手工编辑该生成目录，也不要填写本机绝对路径或私有仓库地址。

### 研究记录同步

同步采用由 Journal `main` 推送触发的公开导出包，个人站不克隆或读取私有 Journal。
需要在本地复现时，先在 Journal 生成导出目录，再导入本站：

```bash
npm run journal:import -- --input /path/to/public-export
npm run journal:check -- --input /path/to/public-export
```

策展白名单位于 `config/journal-curation.json`。游戏设计与框架审计只发布摘要。
Journal 的 `blogs/publication.v1.json` 是文章进入公开导出和个人站发布的授权边界。导入器会在
同一次操作中收敛 `config/blog-publication.json`：既有条目保留站点侧 `status`、语义 `slug`
和 `publishedAt`，从固定导出刷新其余 Journal-owned 元数据；新的语义 ID 默认以该 ID 作为 slug，
并以来源更新时间作为首次发布日期。新 ASCII 标签也会同步进入 taxonomy，既有标签和系列文案不被覆盖。

来源删除、重复 ID、正文哈希不一致、危险内容、非语义 hash ID、未知系列或正文草稿标记仍会
失败关闭。新系列需要站点维护者提供可读的语义 slug 和说明，导入器不会猜测公开栏目名称。
`reviewedJournalCurationHash` 只覆盖人工策展的项目文案、知识流和 featured notes，不把每次自动
同步的 publication 数量伪装成人工复审。

导入器同时检查提交 SHA、数量、正文哈希、危险 HTML、本机路径和凭据模式。

Gitea 到 GitHub 的密钥配置、路径所有权和冲突处理见
[`docs/maintenance/journal-sync.md`](docs/maintenance/journal-sync.md)。

### Consumer Lab 同步

四个消费者仓库的 `main` 推送会从固定提交生成脱敏技术投影，并由站点导入器更新
`data/consumer-lab.json`。源仓只能同步提交、Framework/Unity 版本、包集合和通过计数；项目类型、
摘要与四条核心系统仍由本站策展，且 owner-only 注册表不会打进 Pages artifact。

本地可用以下命令复现单个消费者投影：

```bash
npm run consumer:export -- --source /path/to/consumer --commit <consumer-sha> --output /tmp/consumer.json
npm run consumer:import -- --input /tmp/consumer.json
npm run consumer:check -- --input /tmp/consumer.json
```

证据新鲜度、包集合复核、Runner Secret 与并发冲突策略见
[`docs/maintenance/consumer-lab-sync.md`](docs/maintenance/consumer-lab-sync.md)。

## 发布流程

`.github/workflows/site-quality-and-pages.yml` 在推送和 PR 时执行构建、测试、浏览器冒烟测试与生成状态检查。`main` 验证通过后，工作流只把 `_site/` 作为 GitHub Pages artifact 发布。

## 内容真实性原则

- 规模不等于成熟度；Framework 页面必须同时展示生命周期；
- 原型不等于正式发布；没有 Demo、视频或平台证据时明确标注缺口；
- 私有研究只发布经过策展的摘要；博客必须先通过安全导出，再在站点出版合同中明确批准；
- 联系入口必须真实可访问；
- 新的公共声明需要对应数据、页面证据或验证记录。

## 许可证与素材

代码以 [ISC License](LICENSE) 发布。项目截图和站点视觉素材的版权归 IrisSakura 所有，除非文件旁另有说明；许可证不自动授予这些素材的再发布权。
