# Interactive Labs Phase I：集中验收

验收日期：2026-11-02。结论：三个演示的本地可用版本已完成，Technical、Functional、Outcome 在下列环境和范围内通过。本文记录提交前的本地验收快照，不单独证明线上已提供这些演示。

用户随后于同日明确授权“提交并推送、部署”。交付沿用 GitHub `main` → `Site Quality and Pages`，不改变域名或托管服务；精确提交、Actions 和线上复验结果另存本机 `output/playwright/interactive-labs/deployment-receipt.json`，只有取得对应证据后才报告发布完成。

## 正式入口与可用能力

本机预览根地址为 `http://127.0.0.1:4173`；路径也对应最终 Pages 包的站点根路由。

| 演示 | 路由 | 已可用能力 |
| --- | --- | --- |
| Numeric Workbench | `/pages/labs/numeric-workbench.html` | 修改参数、伤害/DPS、A/B 快照及差值、图形/文本比较、重置、JSON 下载/复制/文件与文本导入；失败保留原实验 |
| Deck Odds | `/pages/labs/deck-odds.html` | 一类/两类不相交目标、起手/累计无放回概率、双方案、最多 25 点曲线及完整采样数值、合法零概率/非法计数、重置和参数导出 |
| Pathfinding Playground | `/pages/labs/pathfinding.html` | 障碍/权重/端点编辑、真实 A* 扩展、单步/暂停/继续/速度、独立失败状态、重置/清空/预设/地图导出、指针/键盘/触屏模拟 |

首页在既有 Projects 区内提供三项入口，保持原有九个主区块顺序及六项一级导航；Violet 与 Sakura 页在项目介绍后提供入口。来源、固定 SHA、许可与行为边界见 [source-contracts.md](source-contracts.md)。

## 候选与环境

- 网站基线：`86653f2e1d3dec503e295cd14ecd811a35e35eaf`，加本批未提交来源和生成变更。不能只凭 HEAD 相同认定候选相同。
- 使用独立 managed worktree；共享网站检出的已有修改未由本批写入或覆盖，上游项目均只读。
- 环境：本机 macOS、Node 24.13.0、lockfile 固定 npm 依赖、Playwright Chromium；另用原生 Google Chrome 窗口确认真实标签切换。C# 对照使用本机 .NET 10 最小程序引用 canonical 源文件，不是 Unity Test Runner 或 Runner 证据。
- 输入哈希与本批路径记录在 `output/playwright/interactive-labs/candidate-manifest.json`；命令日志、浏览器结果和实际下载文件在同目录。

## 三类验收

| 层 | 结论 | 实际证据 |
| --- | --- | --- |
| Technical | 本地通过 | `npm run check`：245 项测试通过，182 个 HTML 页面及本地引用检查通过；完整 smoke、幂等生成、公开包审计、固定上游差分通过 |
| Functional | 本地通过 | 从首页/项目页进入；真实输入、A/B、文件导出/导入、失败保持状态、地图拖动/键盘/触屏、真实步进及历史/刷新/重复挂载清理通过；原生 Chrome 后台暂停与继续另行观察通过 |
| Outcome | 本地通过 | 对照现行纸面/控件/项目配色与改造前入口，实际页面提供三个可完成输入→执行→结果→重置/复现的演示；桌面/窄屏画面、真实操作录像和差异结论见下文 |

## 命令与结果

| 命令/检查 | 结果与收据 |
| --- | --- |
| `npm ci` | 已在新建隔离检出安装 lockfile 依赖；依赖未修改，不反复安装 |
| `npm run check` | 通过；`check-complete.log`，245/245 测试、182 页面检查 |
| `npm run test:smoke` | 通过；`smoke-complete.log`，包含既有站点导航/搜索/阅读/组件/性能及新增实验完整流程 |
| `npm run test:labs` | 定向流程通过；最终相同流程已由完整 smoke 重验；保留早期失败与修复日志 |
| `node scripts/generate-site.mjs` 幂等检查 | 190 个生成输出的前后内容哈希一致；`generation-idempotence.log` |
| `npm run package:site` | 通过；`package.log`；11 项发布入口、4 项运行时公共 JSON，域名一致、无源仓元数据或私有路径 |
| 重新打开 `_site/` 文件 | 12 项入口/JS/Worker/样式与验收来源逐字节一致，未包含 docs/src/output；`package-reopen.json` |
| `git diff --check` | 通过；最终交接再次检查，无空白错误 |

数值差分：24 组 Numeric 输入与固定上游结果一致，最大差异 0；24 组 Deck 输入最大绝对差异 `4.298783551348606e-13`。寻路 37 张固定/确定性随机地图与 canonical C# 的状态、路径、代价和扩展数全部一致；另有 80 张地图对独立 Dijkstra oracle 检查可达性和总代价。收据为 `upstream-math-results.json`、`upstream-path-results.json`，本次临时只读比较程序保存在 `/private/tmp/iris-labs-upstream/`，不打入公开包。

浏览器矩阵为 390×844、768×1000、1440×1000，三个页面共 9 组：横向溢出 0、axe violations 0、运行时异常 0；结果见 `browser-results.json`。静态画面与 axe 检查使用 reduced-motion 稳定装饰帧，前段真实交互录像使用正常动态偏好，搜索单步/播放仍由实际事件推进。

工作量边界：Numeric 固定模型和 32 KiB 配置上限；Deck 在可终止 Worker 内计算，每方案最多 25 个采样点，超时 5 秒；高阈值和最大牌库已纳入数学边界检查。网格查询最多 1024 格/扩展预算，网页预设为 8×8。新增实验 JS 合计 36,441 字节，未压缩共享 CSS 326,478 字节、搜索索引 192,913 字节；未提高已有预算或扩大公开白名单。

## 实际运行与画面对照

目标参考是共享检出现行美学/组件约定，以及本批基线实际运行的首页、Violet、Sakura 页面；没有另造一套视觉系统，也没有恢复历史视觉实验。改造前的六张 1440/390 视口截图在 `before/`。新实验此前没有运行界面，前态就是原项目说明页和缺少在线操作入口的状态，不伪造旧实验画面。

| 观察面 | 改造前→完成后的差异结论 | 证据 |
| --- | --- | --- |
| 首页与项目页 | 原有创作者/作品/文章与项目介绍保留；首页 Projects 内增三项操作入口，项目介绍后直接进入相关实验 | `before/{home,tools,framework}-{1440,390}.png`；`after/` 同名画面与 `*-entrance-*.png` |
| Numeric | 参数真实改变期望伤害/DPS，A/B 数字与柱形有实际差异；导出文件可恢复两个快照 | `after/numeric-comparison-1440.png`、`numeric-comparison-detail.png`、`numeric-workbench-{390,768,1440}.png`；实际 `numeric-experiment.json` |
| Deck | 桌面 A/B 输入并列，窄屏纵向排列；表格/图形均来自组合概率，零后续抽牌显示实际采样点 | `after/deck-comparison-1440.png`、`deck-odds-{390,768,1440}.png`；实际 `deck-experiment.json` |
| Pathfinding | 实际扩展与最终路径、障碍及加权地形可区分；桌面完整 8×8 网格可见，窄屏控制区与网格上下排列；键盘焦点与触屏可操作 | `after/path-result-1440.png`、`pathfinding-{390,768,1440}.png`；实际 `pathfinding-map.json` |
| 连续交互 | 实际修改、保存、导入/导出、拖动、单步、暂停/继续和历史操作均有连续记录 | `interaction.webm`；本次会话另有原生 Chrome 窗口截图及 AX 状态 |

原生后台补验：在本次新建的独立 Chrome 窗口选择慢速，开始/继续后用 Cmd+T 新建真实标签；AX 明确显示实验标签 `off`。关闭该空白标签返回后，实验仍为“已暂停 · RUNNING”，扩展节点为 2；未点击暂停按钮。再点击继续，得到 `FOUND`、扩展 23、路径代价 10、路径格数 11。详见 `native-background-observation.md`，该记录摘录本次 CUA 原生窗口观察。

CLI 的普通标签/生命周期冻结尝试未取得可靠暂停结果，原日志 `background-atomic.txt`、`lifecycle-freeze.txt` 保留为未通过/无效的尝试，不计为后台通过证据；后台通过结论来自上述原生 Chrome 实际标签切换，不宣称 CDP 冻结检查通过。

## 本轮问题、处理与复查

| 现象 | 原因/判断 | 处理与复查 | 原始证据 |
| --- | --- | --- | --- |
| 新页面生成失败 | 种子文档缺少现有 Owner 要求的品牌插槽 | 在模板加入插槽，沿用 Owner 输出；最终生成/品牌/幂等检查通过 | `check.log`、`build-retry.log` |
| 必然事件得到略小于 1 的值 | PMF 浮点求和误差 | 仅对支持集已保证满足的阈值直接返回 1，保留有效边界断言 | `technical-retry.log`、`deck-boundary-retry.log` |
| 表单标签在浅底上接近白字 | 旧共享 `.form-group label` 留有白字 | 在共享 interface Owner 修正语义文字色，9 组可访问性复验 | 早期 `manual-numeric-1440.png` 与最终 `after/` |
| 离屏档案标签被测成默认样式 | content-visibility 子树在滚入后尚未完成绘制 | 等待两帧再测量，保留原几何断言；完整 smoke 通过 | `smoke.log`、`smoke-complete.log` |
| 键盘网格出现两个 Tab 入口 | 指针/脚本聚焦和 roving tabindex 未统一 | focusin 统一当前入口，真实指针/键盘测试明确检查只剩一个 | `labs-retry.log`、最终 smoke |
| 首页主区块顺序断言失败 | 新实验被插为独立顶级区块 | 归入已有 Projects 区块，保留原断言并增加入口归属测试 | `smoke-final.log`、`check-complete.log` |

## 发布与未验证范围

- 本轮本地核心能力无已知阻塞；原生/浏览器观察及包内资源已重新核对。
- 在本地验收快照时，尚未运行 GitHub Actions/Pages，也未 commit、push 或部署；该快照不能替代后续发布证据。
- 未验证 Safari、Firefox、实体手机、真实低性能设备或安装包；Chromium 触屏模拟不替代实体设备。没有 Unity/Player/上游 Runner 通过声明。
- 第二数值模板、行动时间线、其他寻路算法、账户/后端及跨设备持久化未纳入本轮所选范围。
- 已获授权的发布入口是既有 GitHub `main` → `Site Quality and Pages`。交付时先核对远端状态并仅提交本批来源/生成路径，再等待同一提交的 Actions 成功并从线上三个正式路由复验；本地通过不能替代该步骤。
