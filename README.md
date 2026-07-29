# IrisSakura 个人站

这是 IrisSakura 的公开个人品牌站，围绕一条可验证的项目链组织内容：

> Sakura Design Journal（研究）→ Sakura Framework（工程沉淀）→《言铸之剑》（游戏验证）

站点不展示没有事实来源的技能百分比、虚构项目、模拟联系结果或私有仓库地址。

## 页面结构

- `/`：定位、能力证据、精选项目与研究更新；
- `/pages/journal.html`：经过策展的研究摘要；
- `/pages/framework.html`：框架规模、模块浏览器与生命周期成熟度；
- `/pages/game.html`：《言铸之剑》可玩原型案例；
- `/pages/portfolio.html`：三个真实项目及其状态、职责、证据和限制；
- `/pages/about.html`：项目链与能力证据；
- `/pages/contact.html`：已验证的公开联系入口；
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
- `data/framework.json`：由 Sakura Framework 权威清单生成的白名单公开快照。

框架同步和维护边界见 [`docs/maintenance/framework-sync.md`](docs/maintenance/framework-sync.md)。

### 研究记录同步

本机有权读取私有 Journal 时，可以检查其**已提交 HEAD**，不会消费未提交日记或草稿：

```bash
npm run journal:status -- --journal /path/to/sakura-design-journal
npm run journal:sync -- --journal /path/to/sakura-design-journal
```

策展白名单位于 `config/journal-curation.json`。当 `journal:status` 报告已提交内容变化时，先审阅新增或变化的稳定 ID，最多选取少量真正影响框架或作品判断的主题，再运行带 `--advance-source` 的同步。同步器只把策展字段写入公开快照，并拒绝本机路径、仓库地址和外部 URL。它不会提交、推送或部署。

夜间检查由能同时访问两个本机仓库的 Codex 本地自动化执行；GitHub Pages CI 只验证和发布已经进入本站仓库的公开快照。

## 发布流程

`.github/workflows/site-quality-and-pages.yml` 在推送和 PR 时执行构建、测试、浏览器冒烟测试与生成状态检查。`main` 验证通过后，工作流只把 `_site/` 作为 GitHub Pages artifact 发布。

## 内容真实性原则

- 规模不等于成熟度；Framework 页面必须同时展示生命周期；
- 原型不等于正式发布；没有 Demo、视频或平台证据时明确标注缺口；
- 私有研究只发布经过策展的摘要；
- 联系入口必须真实可访问；
- 新的公共声明需要对应数据、页面证据或验证记录。

## 许可证与素材

代码以 [ISC License](LICENSE) 发布。项目截图和站点视觉素材的版权归 IrisSakura 所有，除非文件旁另有说明；许可证不自动授予这些素材的再发布权。
