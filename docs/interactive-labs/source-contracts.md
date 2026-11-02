# Interactive Labs：来源与浏览器契约

本批目标：从首页、Violet Shelf 与 Sakura 项目页进入三个可操作浏览器演示，完成输入、执行、结果观察、比较或复现。批准依据为维护者确认并要求推进的《IrisSakura Interactive Labs · Phase I》修订文档。

## 基线与所有权

- 网站原生 GitHub `main`：`86653f2e1d3dec503e295cd14ecd811a35e35eaf`，开工重新通过 SSH 核对。
- 网站共享检出仍为 `c1dcc3ebdb979830171a51da3276efff3ebdb13a`，存在 48 个已修改文件及未跟踪内容；本批使用从上述远端提交创建的独立检出，不覆盖或搬运其他会话成果。
- Violet Shelf Gitea `main`：`490293f2cf703a9a7fd1a9b571ed71d32a85e099`。
- SakuraGameFramework Gitea `main`：`79e0fa5bbc73dbedb9d05665169f9c2484daa212`。
- 上游仅只读。初始实施阶段没有 Git/发布授权；2026-11-02 用户追加明确授权本网站的 commit、push 和既有 GitHub Pages 部署，不涉及 DNS 或其他云服务变更。仓库源码、生成模板与样式仍各由现有 Owner 管理。

## 公开边界与实现方式

Sakura 的 `docs/licenses/INTERNAL-PROPRIETARY.md` 是内部专有许可，不因可读取而取得公开复制许可。Violet 亦不假定为开源。本批依照维护者批准的演示规格，自行实现通用数学与四方向 A*，只发布规格中允许的模型参数、规则和脱敏演示输入，不复制、机械转译或打包私有模块、模板文档、fixture 原文及产品 Runtime。公式默认值及 golden 数值取自获批准规格；测试输入独立构造。

公开文件只带演示/模型/配置版本；内部源仓 SHA、源码路径与来源对照留在此维护文档，不进入 `_site/`、运行时 JS、访客文案或导出配置。此维护文档含固定 SHA 与代码入口，不含私有源码或 fixture 原文；若后续加入其他内部材料，仍须单独核对其公开依据。发布状态以同一提交的 GitHub Actions 和线上复验记录为准，见 [acceptance.md](acceptance.md)。

## Numeric Workbench

- 上游核对入口：`workbench/modules/numeric-workbench/src/module.mjs`、`schemas/calculate-input.json`、`schemas/result.json`、`templates/model-a.json`、`tests/fixtures.json`、`workbench/tests/numeric/r1-1.test.mjs`。
- 浏览器入口：[数值实验](../../pages/labs/numeric-workbench.html)；实现：`src/labs/models.js` 与 `src/interactive-labs.ts`。
- 所选模型：`attack-crit`，公开模型版本 1。基础伤害为攻击 × 技能倍率 × (1+增伤) × 保留比例；独立暴击期望乘固定命中次数，除时间窗口得到 DPS，无隐式取整。
- Golden：批准规格的默认输入、5 次命中、10 秒窗口，单次期望伤害 2880、总伤害 14400、DPS 1440。
- 网页限定：攻击/倍率/增伤非负，暴击率和保留比例 `[0,1]`，暴击倍率至少 1，命中为 1–1,000,000 整数，窗口为有限正数；拒绝非有限输入与结果。
- A/B 是独立参数快照，在浏览器当前页面会话中保留；配置格式 1 保存当前参数、版本和 A/B。导入限制 32 KiB、固定字段与模型版本，拒绝脚本、任意公式及未知字段，失败不修改当前实验。
- 测试：默认值、0/1 暴击边界、非法输入、溢出、快照与版本化往返；正常默认结果直接等值对照，其他有限浮点值用数值误差比较，不以格式化字符串替代。
- 范围：首轮只有所选解析模型；第二模板、冷却/能量/行动时间线和搜索不在此轮交付中，未展示这些能力。

## Deck Odds

- 上游核对入口：`workbench/modules/deck-odds/src/module.mjs`、`schemas/input.json`、`schemas/output.json`、`tests/fixtures.json`、`workbench/tests/deck-odds/r1.test.mjs`。
- 浏览器入口：[抽牌概率](../../pages/labs/deck-odds.html)。独立实现通过超几何分布的众数归一化递推，以及给定 A 张数后的 B 条件分布求和；没有照搬上游对数阶乘实现。
- 一类模式：B 张数为 0 时忽略 B 阈值；双类模式 B>0，同时满足两类最低张数。均匀、无放回、无重洗牌、两类不相交；实际重叠不能由计数发现。
- 起手与累计结果均相对于原牌库，累计抽取 `openingHand + laterDraws` 张；不输入已知起手结果，不提供已知起手后的条件概率。
- 范围：牌库 1–1000，计数/阈值为 0–1000 整数，类别总数与抽牌总数不能超过牌库；不可能阈值是合法零概率。
- 误差：小牌库完整穷举及批准 golden 绝对误差 ≤1e-12；最大牌库边界另以有限性、归一化/单调性、终态与实际差分检查。数值显示位数不冒称计算精度。
- 工作量：每次最多两个方案、每方案最多 25 个曲线点；计算在独立 Worker，5 秒超时终止，改参/重置/导航/后台暂停取消旧任务。高阈值与完整抽牌区间均纳入验证。

## Pathfinding Playground

- 上游核对入口：Pathfinding 包的 `Pathfinding/Core/{AStarPathFinder,PathRequest,PathStatus}.cs`、`Grid/{GridPathGraph,GridHeuristics}.cs`、包级 `Tests/Editor/PathfindingCoreAuditTests.cs`，以及 Core 公共优先队列的稳定 tie-break 行为。
- 浏览器入口：[寻路实验](../../pages/labs/pathfinding.html)；实现 `src/labs/pathfinding.js`。使用按优先级扫描的小型 frontier，独立于上游堆实现。
- 四方向邻接顺序下、上、右、左，基础步长 1，进入目标格计权；启发式为曼哈顿距离 × 最小可通行权重，同优先级以插入/有效更新顺序稳定处理。
- 网页选择 8×8 编辑网格与预设，权重工具提供 1/6、障碍为 0。模型校验支持 2–32 的宽高与 1–100 权重，预算 1–1024；这是浏览器约束，Core 本身仍允许非正数表示无限预算。
- Core `Success`/`StartEqualsGoal` → `FOUND`，`Unreachable` → `PROVED_UNREACHABLE`，`MaxNodesExpanded` → `BUDGET_EXHAUSTED`，`InvalidRequest` → `INVALID_INPUT`。网页额外前置校验阻塞端点。
- 起终点相同：一个节点、零代价、零扩展。其他搜索终点计扩展；扩展下一个节点前检查预算。失败路径为空，预算耗尽不等于不可达。
- 真实逐次扩展事件驱动单步/播放，速度不改变数学结果。编辑、预设、重置、离开页面取消旧任务；后台暂停，不连续无界运行。地图 JSON 导出含公开规则版本和完整网格输入。
- Wisteria `NavigationQuery` 的 CSR、零启发、`BACKEND_VERSION_MISMATCH` 和 `CLOSED` 不是本网页协议；不声称运行 Unity/Godot/C# 或提供上游事件 API。
- 测试：固定预算/终点计数、非法输入、等端点、真实步进与快照隔离、80 张确定性随机地图对独立 Dijkstra oracle 的可达性/总代价检查。

## 站点与验证 Owner

新路由由 `scripts/lib/interactive-labs-render.mjs` 与现有生成器产生，登记 Page Family、项目导航、Sitemap、全站搜索与内容关联。共享控件继续使用 `.btn` 与 `.form-group`，新 CSS 只拥有实验构图、图表和专用网格语义。所有运行资源经既有 Pages 打包与白名单检查。

验收与实际证据见 [acceptance.md](acceptance.md)；本地验证不代替 GitHub Actions、部署或线上交互证据。
