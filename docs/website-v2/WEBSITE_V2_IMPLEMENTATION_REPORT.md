# Website V2 实施报告

范围：个人网站完整 V2；授权依据为修订后的 [APPROVED_SPEC.md](APPROVED_SPEC.md)。基线为 `91f5c4617f09dcf8b2320e13e5672b88cbe12680`。本批次未提交、推送或发布。

## 已实现

- 六项目展示配置：品牌身份、职责、产出、近况、关联项目与 Hero 策略。作品数据仍由原有 `data/projects.json` 维护，稳定 ID 与公开状态不变。
- 六 Reference Pages：Iris 工作流轴；Sakura 模块分支；Myosotis 档案入口；Violet 原生工具抽屉；Freesia 按游戏组织的探索路线；Wisteria 窗、地平线、人物、前景组成的空间叙事。
- Home 按个人身份、近况、作品、制作、思考、探索、生活、更新、关于组织。Development 以角色关系和各项目产出为入口，不再放六张人物卡。
- Blog 按月份和日期发布；Series 按时间正序提供阅读路径；Tag 保持时间索引。文章提供目录、正文和系列上下文，移动端目录折叠；代码与表格有独立的可聚焦横向滚动区域。
- 框架深层页面、研究正文/公开摘要、Portfolio、Game、Now、Contact、Brand、Subscribe、404 使用分层样式和页面分类。兼容地址与已有检索、模块筛选、订阅复制、软导航及动效偏好保持。
- 139 个 HTML 保持生成器所有权。页面矩阵见 [WEBSITE_V2_PAGE_MATRIX.md](WEBSITE_V2_PAGE_MATRIX.md)。只存在摘要的研究内容继续使用摘要；未新建没有正文的 Mods 详情页。

## 样式责任

`style/main.css` 是兼容入口，正式导入链为 `style/site.css`。层顺序为 reset → tokens → base → shell → components → personas → pages → utilities。旧页面 CSS URL 保留为空兼容入口，避免软导航和引用路径中断。

基础排版、导航、控件、装饰、页面结构、阅读器分别归属 owner。`style/pages/grammar.css` 管理六种构图；`style/components/reading.css` 在 pages 层管理阅读页面。Persona 层只提供身份变量与装饰。

迁移合并 287 个同选择器/上下文的重复声明，替换 207 个旧选择器记录，删除 40 个已有新 owner 的旧声明。具体源文件、目标文件和清理项见 [CSS_MIGRATION.json](CSS_MIGRATION.json)。分组选择器按成员拆分，保留仍被当前页面使用的规则。

## 保留的事实与边界

151 个资产、内容数据和订阅/站点地图基线文件哈希一致，六张透明人物母版及其派生图未改动。原有 `findings.md`、`progress.md`、`task_plan.md` 哈希一致。未更改其他仓库。

Wisteria 的场景是网页视觉构图，不是产品实机截图；现有制作状态与无公开下载的边界保留。Violet 抽屉解释已有工具用途，不伪装成本机安装检测或网页在线工具。

技术与视觉证据分别见 [WEBSITE_V2_TECHNICAL_ACCEPTANCE.md](WEBSITE_V2_TECHNICAL_ACCEPTANCE.md)、[WEBSITE_V2_VISUAL_ACCEPTANCE.md](WEBSITE_V2_VISUAL_ACCEPTANCE.md)。
