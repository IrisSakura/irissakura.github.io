# Framework Engineering Hub 维护说明

Framework Engineering Hub 是 Sakura Framework 的架构与证据导航页，不是十个领域的逐包详情页。
Hub 合同与六个深页策展合同都固定绑定 Framework immutable commit
`9d436c62f5cfbe78c84c9ef44fe8b5f8214d5cd1`。

## 内容边界

- D0 Signal、D1 System、D2 Architecture、D3 Evidence 是阅读深度，不等同于成熟度等级。
- Understand Sakura、Explore Engineering、Start Using 必须继续指向 Hub 内真实锚点。
- 十个领域都必须绑定 generator-owned 真实深页；只有对应页面、合同与路由验证同时存在时才允许显示 `implemented`。
- Hub 的公开证据边界保持 `local-passed / runner-pending` 与 `Production: unknown`，直到同一提交的
  Runner 或 Production 证据分别闭合。

Evidence Authority 合同位于 `tests/contracts/framework-evidence-authorities.json`，它是
Designed、Implemented、Local、Runner、Consumer、Release、Production 与 Unknown 的权威映射。证据等级
不能跨级声明，Unknown / Deferred 不是可由文案填补的空白。

## 深页合同与生成路由

- `data/framework-architecture.json`：Governance、Cross-Engine、Decisions、Runtime、UI、Gameplay；Decisions 固定 10×7 结构。
- `data/framework-evidence.json`：Tooling、Evidence、Consumer Matrix 与 Case Index；Consumer 事实只读取 `data/consumer-lab.json`。
- `data/framework-case-studies.json`：五个旗舰 Case，每个固定 12 段。
- `data/framework-evolution.json`：不暴露内部 PLAN/TODO 的公开演进时间线。
- `data/framework-knowledge-graph.json`：只解析 publication-approved article/series 与现有 Evidence Chain。
- `data/framework-module-reference.json`：12 个精选模块；完整模块数量继续由 `data/framework.json` / Inventory 拥有。

`tests/contracts/framework-plan-coverage.json` 必须绑定原规划 SHA-256，并包含 `REQ-001..REQ-095`。
除 REQ-075/091 这两个明确 non-goal 外，每项必须映射到上述真实 Owner 和已生成 route/anchor；测试文件不能成为内容 Owner。

## 生成与验证

页面骨架由 `components/framework-page-shell.html` 提供；`scripts/generate-site.mjs` 在读取并校验
Engineering、需求覆盖和 Evidence Authority 合同后，生成 `pages/framework-engineering.html`、
页面索引、canonical、JSON-LD、sitemap 与 social owner 输入。不要直接编辑生成页正文。

```bash
npm run generate
node --test tests/framework-*.test.mjs
node --test tests/page-index.test.mjs tests/site-governance.test.mjs
git diff --check
```

浏览器验证还应覆盖桌面与 390px 视口、键盘 focus、reduced-motion、页面无横向溢出、18 条
深页、10×7 Decision、5×12 Case、八级 Evidence、七个 Consumer 与 12 个精选 Reference。新增内容仍需由根站 smoke 与发布前检查
分别验证；本地通过不等同 Runner 或 Production 通过。
