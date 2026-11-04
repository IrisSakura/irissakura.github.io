# 2026-10-16 内容与事实刷新

## 范围与基线

本轮由维护者在认可《个人网站更新规划》修订版后明确要求“开始推进”。网站基线为 `124f006eb9fcb5abf38354186f8193b36ec60b44`，本地候选包含本记录所列修改；网站未获 commit、push 或 Pages 发布授权。维护者随后明确批准 Violet 来源迁移及必要本地源端提交；该授权不包含推送或发布。

```text
Operating mode: development-convergence（Framework 源仓只读路由结果）
Primary objective: 网站内容、事实与证据刷新
Release preparation enabled: 否
Eligible Work ID: 无；本次是维护者明确指定的网站任务
Why this work is executable: 已确认规划，并明确要求开始实施
Explicitly excluded scopes: 源产品 Runtime、模块晋级、Runner 调度、Tag/Release、远端写入、Wisteria 产品媒体、自动 freshness
```

保留开工前已有的 `README.md` 修改与未跟踪的 `docs/brand/asset-sources.md`、`docs/maintenance/project-navigation.md`。Framework 路由状态有效且为 `route-only`，仅读取已提交权威清单并调用现有白名单生成器，不恢复源仓工作项。

## 来源与更新矩阵

2026-10-16 通过各源仓既有 SSH 远端只读读取 `refs/heads/main`，六个源仓当时均与本地 HEAD 相同。Violet 后续新增下表所列本地提交，尚未推送，远端仍是开工时 `407e4313a57292980e2310fd31ff23b57b047213`。GitHub 个人站 `main` 同样直接核对为网站基线。原规划中“远端尚未核实”的限制在本次执行中已补足；没有重新运行源产品验收或回下载其 Runner/Release 产物。

| 对象/事实 Owner | exact commit 与入口 | 证据范围 | 网站文字 Owner / 修改 | 媒体与许可 | 复审触发器 |
| --- | --- | --- | --- | --- | --- |
| Framework | `7774568547a725b427e055a8a69b47315378a707`；已提交 Inventory、PLAN-INDEX、Work Status | source main 已核对；Preview 的本地检查与缺口来自具名源记录，非本轮运行 | 源生成器更新 `data/framework.json`；网站维护章节、采用表达及项目摘要 | 不新增媒体；原公开白名单 | Supported/stable 指纹、采用闭包、具体能力或验证范围变化 |
| Violet Shelf | 开工基线 `407e4313a57292980e2310fd31ff23b57b047213`；本地公开投影提交 `281a0af5123df8620f23cda6576f6cc29b6bec5f` | 开工 source main 已核对；新提交已做本地导出/导入，未取得远端 workflow 证据 | 网站策展介绍创作、阅读、诊断；新 profile 经 exporter 建立新基线，旧投影归档 | 保留既有自建 Card Studio 示例；不复制工具内外部作品预览 | 产品入口、CLI/GUI 集成、平台/验收或同步 Owner 变化 |
| Wisteria | `cbdae59dd0e17aafc8e2154aa6e603d5e22f5041`；`docs/00_CURRENT_STATE.md` | R8 已安装本地验收与 R3 未安装候选分别记录；性能 HOLD、人工视觉、实体输入边界保留 | 网站以桌面用途、相伴入口、状态和恢复重组章节；清除过时启动故障叙述 | text-only；无产品截图、模拟视图或第三方角色投影 | 新安装、候选转正、实际限制变化；媒体合同独立审批 |
| Iris Engineering | `0defee8af36615989de811b0e515bd0f336dbbdd`；现有导入 payload/provenance 与源能力记录 | source main 与已导入来源一致；本地恢复不扩大到真实远端/新机器 | 只维护网站叙事、Now 与关键词，保留源 payload 和历史项目条目 | 不新增媒体 | 授权/执行链、BuildID、Workbench/Continuity 或环境实测变化 |
| Myosotis | `8a8c19b9f1b98625da8c709ca6fa075aa4788862`；已导入 Journal public export | source main 与导入来源一致；只消费已批准公开的摘要/文章 | 网站调整阅读路径与研究连接；不额外导入私有正文或修改 publication | 沿用出版合同，无新增媒体 | 正式 public export、publication 或首页推荐变化 |
| Freesia Mods | `4ece05fd220412145a77195f14b8f997765e527e`；既有 The Weaver/Iris Core 来源 | source main 已核对；既有程序内容与 Headless 范围保留，不增前台/多人/发布主张 | 复核既有精选作品和阅读连接，本轮不扩充作品目录 | 保留既有来源记录，不新导入第三方素材 | 作品版本、可体验入口、验证和许可变化 |
| Now / Updates / 首页 | 上述已核实事实与本站编辑行为 | 2026-10-16 站点编辑；项目事件日期分别核实 | 网站人工编辑，不修改历史动态日期 | 沿用既有品牌与作品图 | 有访客阅读价值的重大事实，不追逐每次 commit |

Framework 新快照由源仓 `tools/docs/generate-public-site-data.mjs` 读取 exact commit 的 Inventory 产生。新旧 `adoptionReviewHash` 均为 `sha256:39f7a5c16a99eb9d2936159a6c10f397249b4187fa64d09bd26c736da4073849`：Supported 身份与 stable 闭包不变，保留现有 adoption/Quickstart，不改 hash 过关。快照时间采用源提交时间，不冒称 Runtime 验收时间。

Story/Engineering Hub/深页继续绑定原有审核基线；本次开发实例在独立策展章节中说明，不改写其既有证据等级。`v0.8.27` 是 Runtime Foundation 的历史固定版本；Config Core 专用最终同 SHA Runner 与独立 Tag/Release 仍待补齐，不能用前者关闭后者。

## Violet 同步诊断与恢复边界

可复现观察：

1. 诊断时源仓不是 shallow clone；当时 live source main 为 `407e4313a57292980e2310fd31ff23b57b047213`。
2. 诊断时该提交的完整 tracked tree 没有 `config/public-site-project.json`、public-site exporter 或 `.gitea/workflows/`。因此该版本不能产生站点维护合同所述 source event/export；没有证据归因为 credential 或 Runner 故障。
3. 站点原 provenance 的 source/profile commit 为 `2d18a7dee5787d9c6f666fe41dc700580e7fbc4d`，该对象在当前源仓本地完整历史中不可解析，无法证明旧到新 ancestry。尚未取得可证明历史迁移的回执。

复查命令（在 Violet 源仓运行，保持只读）：

```bash
git rev-parse --is-shallow-repository
git ls-tree -r --name-only HEAD
git cat-file -t 2d18a7dee5787d9c6f666fe41dc700580e7fbc4d
git log --all -- config/public-site-project.json
git ls-remote origin refs/heads/main
```

**处理状态：已获授权并完成本地来源迁移，远端自动同步未激活。** 维护者在本任务中明确批准“来源迁移及必要的本地源端提交”。Violet 新增 profile、固定提交 exporter、5 项回归和 source-push workflow，并将文档入口与 npm scripts 纳入本地提交 `281a0af5123df8620f23cda6576f6cc29b6bec5f`；未改产品 Runtime，也未 push。

[一次性迁移归档](source-migrations/iris-shelf-2026-10-16.json) 保存原 provenance 和完整原项目条目，以及新基线和授权说明。按显式授权安装经既有 validator 验证的新 payload/provenance，然后使用未修改的 `project:import` 验证 no-op、`project:check` 核对 exact commit/hash。未新增自动 rebaseline 或 ancestry 豁免，旧/旁支和 same-SHA drift 仍按原规则拒绝。注册表除 Violet 与本轮 Framework 策展外，其他项目语义未变化；文件采用 importer 的规范格式。

远端恢复入口：另获相应 push/发布授权后交付源端与网站迁移，再检查 runner label、仓库独立 secrets 和真实 workflow。若源事件先到而网站仍在旧基线，必须失败关闭，待获批网站迁移完成后显式重跑。不得删除 provenance、force push 或自动改基线处理冲突。

## 人工复审步骤

先从上述 Owner 读取有意义的事实变化，再逐条比较公开主张、证据、许可与页面位置。项目使用既有 `updatedAt` / `lastReviewedAt`，Iris 使用 `sourceUpdatedAt`，Framework/Journal 使用 `generatedAt`；人工复审时间保存在本记录，不新增通用 payload 字段。不以日期旧或 source SHA 不同自动断言内容失效。

采用/出版/素材按原合同处理。只改网站策展时不重跑不受影响的 importer；完成整批后集中生成与验收。新 facts、摘要、状态、CTA 和搜索须一致；未核实的新主张隐藏，旧 provenance 原样保留。自动报告、新 Wisteria 投影和新媒体仍是候选。

## 候选验收与回退

本地候选已完成以下验收。日志、前后截图、候选输入与逐文件指纹保存在本任务临时证据目录 `irissakura-site-refresh-20261016`；这些开发证据没有进入 Pages artifact。

| 范围 | 实际检查与结果 |
| --- | --- |
| 网站整批 | 迁移后 `npm run check` exit 0：JSON、证据 authority、生成/构建、品牌、229/229 单测及 160 HTML/本地引用通过 |
| 浏览器 | `npm run test:smoke` exit 0：导航/历史/键盘与输入、搜索、关联阅读、订阅、无障碍、性能和移动路径通过；保存桌面/手机截图 |
| 浏览器证据复用 | Violet 来源迁移前后的最终 `_site` 共 484 个文件逐文件 SHA-256 相同。浏览器脚本从项目注册表使用的《言铸之剑》对象亦未变化；未因新增 Owner provenance 重跑未失效的浏览器覆盖 |
| 最终部署包实际入口 | 在 `_site` 的本地 HTTP 预览上，以 1440px 与 390px 实际点击：首页 → Wisteria，作品 → Violet 视觉阅读，Now → Preview → Quickstart，Journal → 研究正文 → 订阅；均通过。Wisteria 主内容无媒体与下载链接 |
| 公共产物 | 迁移后 `npm run package:site` exit 0；四份运行时 JSON 白名单与隐私扫描通过，旧/新 provenance 和迁移归档未进入公开包 |
| 源端 exporter | `npm run test:public-site` 5/5：固定提交、未提交输入隔离、profile/source 时间语义、shape/版本/隐私拒绝、符号链接和不同输出拒绝、workflow 范围/FF 契约通过 |
| 真正导出/导入 | 正式 CLI 从 source `281a0af5123df8620f23cda6576f6cc29b6bec5f` 导出；本站未修改的 `project:import` 幂等 no-op 与 `project:check` exact-commit/hash 核对通过 |
| 同步 scope | 隔离 fixture 使用同一 source export 和原 importer，首次写入仅两个 Owner 路径，原 scope guard 通过；重复导入/核对通过，注入额外文件后 guard 按预期拒绝。未在共享 dirty 工作区扩大白名单 |
| 源仓维护 audit | 原工作区 `npm run audit` 被既有 ignored `output/game-diagnostics/2026-10-15-udgap/personal-utilities-game-diagnostics-0.1.0.tgz` 阻挡，未删除。对同一新提交的干净 `git archive` 副本复用现有依赖后，Portfolio 与 Tool Garden audit 通过；不能将其写成原工作区 audit 全绿 |
| 变更边界 | 网站原有三项工作逐文件 hash 不变；注册表仅 Violet 与 Framework 条目语义变化，旧 Violet 条目和 provenance 与归档逐值相同。网站没有 staged 内容或新提交；Violet 本地提交后工作区干净 |

首轮网站检查发现了旧文案/日期/章节断言，以及空 presentation fixture 的渲染问题和根路径 CTA 与既有引用校验的冲突。已修正为新章节顺序、当前来源日期、稳定身份与相对链接；媒体拒绝、无下载、escaping 和 ancestry 等有效断言保留。最终整批检查按上表通过。

未运行：源产品 Unity/Godot 或桌面 Runtime 回归、独立 Agent 审查、真实远端 source-push workflow、Runner/凭据配置、GitHub Actions/Pages 部署及线上验收。本轮没有修改源产品 Runtime；默认未启用三级编排。远端激活继续需要对应授权，网站检查不替代这些证据。

回退基线为本记录顶部网站 HEAD。后续仅反向恢复本任务明确修改的 Owner 和派生产物；不得 reset/clean 或覆盖开工前已有三项工作。未 commit 时没有新的“回退提交”；发布前另行记录获授权的实际提交。

Violet 的本地来源基线为 `407e4313a57292980e2310fd31ff23b57b047213`，本轮仅在其上新增上述单个提交。若后续需要回退，针对七个源端路径作具名反向变更并保留网站迁移归档；不修改远端历史，也不将旧 provenance 自动重新启用。

## 后续浏览体验优化（2026-10-16）

维护者继续要求优化个人网站。本轮基于上一轮未提交候选施工，网站 HEAD 仍为 `124f006eb9fcb5abf38354186f8193b36ec60b44`。仅调整浏览入口、阅读顺序和布局，不变更产品事实、同步基线或源端仓库。

- 实际浏览发现 Violet 的 `.tools-main { overflow: hidden }` 使内部 sticky 目录随正文滚出视口。改用 `overflow: clip` 保留装饰裁切，恢复目录吸附；浏览器回归覆盖长距离滚动后从目录返回视觉阅读，标题不被导航遮挡。
- 视觉阅读移到工具目录之前，目录顺序同步；原章节 ID 和外部深链接保留。
- 首页四条近况在桌面使用两列，移动端仍为一列。作品页两项本地应用使用完整两列，补充现有的阅读与当前进展入口。
- 工具抽屉保留原生键盘操作，展开与收起的符号对应实际状态。

Owner 为 `scripts/generate-site.mjs`、`scripts/lib/living-site-render.mjs`、`style/pages/{tools,personal,portfolio,grammar}.css`；页面由生成器重生。证据目录为本机临时目录 `irissakura-site-usability-20261016`，保存开工完整 dirty diff、输入指纹、验收日志及桌面/手机截图。

| 范围 | 本轮实际证据 |
| --- | --- |
| 静态与构建 | `npm run check` exit 0，229/229 单测、160 HTML 页面与本地引用通过 |
| 公开包 | `npm run package:site` exit 0，四份运行时 JSON 白名单与隐私扫描通过 |
| 最终包入口 | 1440px / 390px 实际点击作品页 → Violet 视觉阅读；滚动 5000px 后目录可见且可返回章节；键盘展开/收起与符号状态通过；卡片宽度与页面无横向溢出通过 |
| 完整浏览器回归 | `npm run test:smoke` exit 0；含 390–2048px 布局、目录吸附与锚点遮挡、导航/历史/键盘、搜索、关联阅读、无障碍、性能与移动端入口；最终日志为 `browser-smoke-final.log` |
| 边界 | 原有 README、品牌素材记录和项目导航记录三项 hash 不变；无 staged、新提交、push 或发布 |

首次补充的目录断言误将目录与导航间隙限制为 4px，实际既有桌面留白为 4.25px。定位后改为核对 CSS 声明的吸附位置与导航遮挡，补上明确超时；未修改页面留白来适配错误断言。旧浏览器运行已停止，最终回归单独保存日志。网站检查不代表源产品 Runtime 或线上 Pages 验收。

## 后续项目入口优化（2026-10-17）

维护者继续要求推进网站优化。开工时仍在上述未提交候选上，HEAD 未变化；本轮只调整项目总览的浏览入口与响应布局。

原速览六项仅链接本页介绍，读者需要继续寻找进入项目的按钮。现在每项额外提供由 `config/site-presentation.json` 的 `primaryAction` 驱动的直达入口：工程工作流、框架采用路线、研究检索、创作流程、Mod 作品和桌面体验。原简介锚点、六项完整介绍与项目关联链接保留。

手机速览改为两列并缩小装饰图标，直达链接保留至少 44px 点击高度。390px 下速览高度从约 1154px 降至约 775px；英文长名称在词边界断行，完整名称和项目身份未变化。没有新增路由、外部依赖或运行时状态。

Owner 为 `scripts/lib/website-v2.mjs`、`style/pages/{grammar,notebook}.css` 和 `style/components/project-icons.css`，由既有生成器重生 `pages/development.html`。维护证据保存于本机临时目录 `irissakura-site-discovery-20261017`，不进入公开包。

| 范围 | 本轮实际证据 |
| --- | --- |
| 全站检查 | `npm run check` exit 0，230/230 单测与 160 HTML 页面引用通过 |
| 公开包检查 | `npm run package:site` exit 0，四份运行时 JSON 白名单与隐私扫描通过 |
| 入口与布局 | 最终包在 1440px / 390px 逐个使用键盘打开六项直达入口并返回；320 / 390 / 600 / 601 / 900 / 1440px 布局无横向溢出，链接高度与名称未裁切；原简介锚点和关闭 JavaScript 后的入口通过 |
| 完整浏览器回归 | `npm run test:smoke` exit 0，导航/历史/键盘、390–2048px 布局、全站搜索、关联阅读、无障碍、性能、移动端入口通过，日志为 `browser-smoke.log` |
| 名称断行复核 | 在转义后补充单词边界；重生后 29/29 受影响测试、160 页引用检查、最终公开包检查与上述全部入口/布局验收再次通过，复看手机截图通过 |
| 证据复用 | 名称断行修正前后 484 个公开文件仅 `pages/development.html` 改变；重复该页六种宽度及完整入口路径验收，其他页面与运行时字节相同，复用此前完整浏览器回归 |
| 边界 | `data/`、`config/` 与三项受保护文件 hash 不变；无 staged、新提交、push 或发布 |
