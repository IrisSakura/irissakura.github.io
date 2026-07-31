# IrisSakura 个人站

这是 IrisSakura 的公开个人品牌站，围绕一条可验证的项目链组织内容：

> Sakura Design Journal（研究）→ Sakura Framework（工程沉淀）→《言铸之剑》（游戏验证）

站点不展示没有事实来源的技能百分比、虚构项目、模拟联系结果或私有仓库地址。

## 页面结构

- `/`：定位、能力证据、精选项目与研究更新；
- `/pages/journal.html`：经过策展的研究摘要；
- `/pages/blog.html`：Journal 中登记并通过安全门禁的完整博客正文；
- `/pages/framework.html`：框架规模、模块浏览器与生命周期成熟度；
- `/pages/game.html`：《言铸之剑》可玩原型案例；
- `/pages/portfolio.html`：真实项目及其状态、职责、证据和限制；
- `/pages/about.html`：项目链与能力证据；
- `/pages/contact.html`：工作邮箱、工作 QQ 与已验证的公开联系入口；
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

- `npm run generate`：从公共模板和 JSON 事实源生成导航、页脚、SEO、sitemap 与 Framework 静态回退；
- `npm run build`：生成站点源文件并把 TypeScript 编译到 `dist/`；
- `npm test`：运行数据契约、内容真实性、链接、资源和 HTML 语义检查；
- `npm run test:smoke`：用无头 Chromium 检查主要页面、移动导航、FAQ 与作品筛选；
- `npm run package:site`：把发布所需文件复制到 `_site/`。

`dist/` 和 `_site/` 都是 CI 产物，不进入主分支。不要直接修改生成文件。

## 数据来源

- `data/site.json`：品牌定位和真实社交入口；
- `data/projects.json`：三个公开项目的状态、职责、证据与限制；
- `data/journal.json`：私有研究仓库的站内策展快照，不含仓库地址；
- `data/journal-source.json`：由 Journal 固定提交生成的公开摘要与博客清单；
- `content/blogs/`：获准全文公开、经过链接改写和内容检查的 Markdown；
- `data/framework.json`：由 Sakura Framework 权威清单生成的白名单公开快照。

框架同步和维护边界见 [`docs/maintenance/framework-sync.md`](docs/maintenance/framework-sync.md)。

### 研究记录同步

同步采用由 Journal `main` 推送触发的公开导出包，个人站不克隆或读取私有 Journal。
需要在本地复现时，先在 Journal 生成导出目录，再导入本站：

```bash
npm run journal:import -- --input /path/to/public-export
npm run journal:check -- --input /path/to/public-export
```

策展白名单位于 `config/journal-curation.json`。游戏设计与框架审计只发布摘要；
`blogs/publication.v1.json` 登记的博客发布完整正文。导入器会再次检查提交 SHA、数量、
正文哈希、危险 HTML、本机路径和凭据模式。

Gitea 到 GitHub 的密钥配置、路径所有权和冲突处理见
[`docs/maintenance/journal-sync.md`](docs/maintenance/journal-sync.md)。

## 发布流程

`.github/workflows/site-quality-and-pages.yml` 在推送和 PR 时执行构建、测试、浏览器冒烟测试与生成状态检查。`main` 验证通过后，工作流只把 `_site/` 作为 GitHub Pages artifact 发布。

## 内容真实性原则

- 规模不等于成熟度；Framework 页面必须同时展示生命周期；
- 原型不等于正式发布；没有 Demo、视频或平台证据时明确标注缺口；
- 私有研究只发布经过策展的摘要；只有明确登记的 `blogs/` 文章允许全文发布；
- 联系入口必须真实可访问；
- 新的公共声明需要对应数据、页面证据或验证记录。

## 许可证与素材

代码以 [ISC License](LICENSE) 发布。项目截图和站点视觉素材的版权归 IrisSakura 所有，除非文件旁另有说明；许可证不自动授予这些素材的再发布权。
