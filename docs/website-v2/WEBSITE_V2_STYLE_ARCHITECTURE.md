# Website V2 设计与实施方案

PLAN_VERSION: 1
REVIEW_RISK: NORMAL
REVIEW_FOCUS: 页面结构差异、阅读体验、稳定路由与事实、CSS 责任与移动端
ROOT_CAUSE_ID: WEBSITE-V2-PAGE-GRAMMAR

## 设计冻结

共享层：reset → tokens → base → shell → components → personas → pages → utilities。统一字阶、行宽、间距、导航、页脚、按钮、焦点、减少动效。Persona 只负责变量与装饰，页面 owner 负责布局。

- Iris：左侧介绍 + 右侧工程状态轴；下方流程、矩阵与证据链。
- Sakura：上方标题 + 模块分支结构，角色沿结构一侧；下方采用路径和真实技术材料。
- Myosotis：档案索引 Hero、检索与知识流；出版页按日期分组，系列按阅读顺序，标签按时间索引。阅读器三栏（TOC / 44rem 正文 / 系列上下文），中屏上下文下移，小屏目录 disclosure。宽代码与表格独立跨列行，不覆盖侧栏。
- Violet：人物坐在工作台旁、六个已有工具以架层 + 抽屉详情呈现；不读本机 Installed 状态。
- Freesia：按真实游戏与作品形成探索路径，开放构图及轻微倾斜；不增加空页面。
- Wisteria：横向大场景构图、前中后景、窗与提灯意象，分层生活叙事；所有未交付能力仍表述为方向。
- Home：Identity → Now → Play → Build → Think → Explore → Live → Updates → About；不展示六张等大人物卡。
- Development：关系图 + 项目角色、负责内容、产出、状态及连接；作品不变成品牌目录。
- Portfolio / Game：截图、体验和实际结果主导；Now / Contact 保持本人主体；Brand 专门展现六页结构差异；Subscribe / 404 极简。

## CSS 迁移

KEEP：现有 token 色板、技术组件交互、真实内容结构、输入控件与无障碍行为。
MOVE：main.css / iris-sakura.css 中有效规则按职责归入 tokens、base、shell、components、pages；原入口保留兼容薄入口。
MERGE：旧主题覆盖与相同选择器的重复声明收敛；Blog 暗色样式和品牌覆写合并为单一浅色阅读 owner。
DELETE：已退役人物布局、六卡首页/项目总览布局及无消费方的签名面板；保留历史图源，不再次分发。
DEPRECATE：独立品牌覆盖文件作为薄兼容入口，正式样式从 site.css 有序加载。不得新增末尾覆盖补丁。

## 主要文件与不变量

编辑 config/site-presentation.json、config/personas-v2.json（保留素材字段）、新增 config/page-families.json；scripts/generate-site.mjs、scripts/lib/site-presentation.mjs、living-site-render.mjs、新增页面/阅读渲染 helper；style 下按 owner 整理；src/site.ts 仅按新目录/抽屉必要行为修改；受影响测试及生成 HTML。

所有现有公开事实与作品 ID 保持，品牌目录扩展为六项；已有 URL、canonical、JSON-LD、RSS、sitemap、搜索、菜单、持久导航和复制订阅保持。保持生成器所有权，未知并发改动停止受影响写入。设计内实现选择自主处理，不新增发布或跨仓库工作。

## 验证

六 Reference Pages 成形后做一次内部结构复核，再连续完成全站。最后集中 npm run check、browser smoke、package:site；全路由截图，代表性页面覆盖 2048/1600/1440/1280/992/900/769/600/390；Article 的正文宽度、目录、表格/代码、锚点、移动折叠；Page Silhouette、Blur、Content-Off、Persona-Off；人工浏览阅读路径并记录与真实用户长期阅读疲劳评估的区别。完整输出后集中修复失败，不重复无关重型检查。
