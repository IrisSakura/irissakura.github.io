# Persona V2 迁移方案

PLAN_VERSION: 1
REVIEW_RISK: NORMAL
REVIEW_FOCUS: 六角色映射、正式页面入口、移动端完整轮廓、旧人物引用清零、来源与发布体积。
ROOT_CAUSE_ID: PERSONA-V2-SITE-MIGRATION

| 角色 | 页面 | 透明母版 | 构图与语义 |
|---|---|---|---|
| Iris | engineering.html | 05_Iris/iris.png | 深蓝/白银、工程网格、稳定垂直姿态 |
| Sakura | framework.html | 03_Sakura/sakura.png | 樱粉、斜向展开、模块节点 |
| Myosotis | journal.html | 04_Myosotis/myosotis.png | 蓝白、书页与记录、坐姿书卷 |
| Violet | tools.html | 06_Violet/violet.png | 紫色、工作台与收纳、坐姿支撑 |
| Freesia | mods.html | 02_Freesia/freesia.png | 黄白、开放分支、外展动作 |
| Wisteria | wisteria.html | 01_Wisteria/wisteria.png | 米白/橄榄/灰棕、拱门和垂落的紫藤 |

## 实施边界

新增 config/personas-v2.json、共享 persona 渲染、独立样式和素材派生脚本。六张 PNG 母版保持字节不变；从 PNG 直接派生 WebP、AVIF、缩略图及分享图。旧技术 ID 和四项目事实来源不变，六角色展示层单独管理。生成器负责所有公开页面与元数据。

主要编辑：scripts/generate-site.mjs、scripts/lib/living-site-render.mjs、scripts/lib/social-image.mjs、brand 配置/契约、打包脚本，以及受影响测试。新增 Wisteria 页面只表达附件提供的持续桌面世界理念，明确仍在制作，不添加下载按钮。About 用文字链接连接六项目，正文与游戏截图保持内容优先。

现有矢量 Logo 与花卉图标符合小尺寸用途，保留其识别结构；不从设定稿生成新角色或矢量人物。历史人物保留于已有来源目录，并排除发布包。

## 不变量与集中验收

- 六个角色与项目一一对应；没有 V1 人物公开引用。
- 所有人物等比 contain；首屏加载优先，下面图片懒加载；显式尺寸和响应式 source。
- 运行 npm run check、现有 browser smoke、package:site；新增桌面/平板/手机/超宽检查及 Thumbnail、Blur、Silhouette、Content-Off 视觉记录。
- 验证输入 PNG 哈希、公开链接、资源解码、无横向溢出、交互与原有知识检索/导航。
- 保留已有未跟踪文件；不 commit、push 或发布。
- 若出现并发修改重叠、素材缺失或核心身份冲突，停止相关写入并说明。
