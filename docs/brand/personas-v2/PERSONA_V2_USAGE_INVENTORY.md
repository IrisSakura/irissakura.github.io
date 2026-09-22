# Persona V2 使用调查

范围：个人网站全部相关页面；用户于 2026-09-22 确认。不会修改其他项目仓库、创作者身份、游戏截图或发布状态。

基线：`f32cc68275ea05f085d637652b2f30d6c5e54079`。已有未跟踪 `findings.md`、`progress.md`、`task_plan.md` 原样保留。

| 当前资源 / 所有者 | 公开使用位置 | 当前情况 | V2 目标 |
|---|---|---|---|
| config/brand.json: *HeroArt; images/brand/site-v2 | Engineering、Framework、Journal、Tools 首屏 | 四张旧人物主视觉，共享蒙版和低透明度布局 | 新透明人物、独立文字和图片区域、不同项目背景 |
| scripts/generate-site.mjs: renderBrandContent; images/brand/v1/character-* | 品牌页四人物区 | 四项目和旧配色 | 六人物、六项目映射、V2 色板 |
| brand.assets.freesiaHeroArt | Mods 首屏、品牌页 Freesia 系列 | Freesia 旧人物 | V2 Freesia，保留现有作品与入口 |
| scripts/lib/living-site-render.mjs | 首页项目入口 | 四个无人物项目卡 | 六项目、不同色块/姿势/意象 |
| scripts/generate-site.mjs: writeDevelopmentSource | 项目总览 | 四入口 | 六入口，增加 Mods 与 Wisteria |
| Contact / About、Portfolio、文章和技术详情 | 个人介绍、游戏内容、正文 | 没有需要替换的项目人物；使用共享导航和元数据 | 保留内容优先，About 补充六项目文字入口 |
| Wisteria | 暂无独立页面 | 缺少入口 | 增加理念介绍页；不虚构下载、运行验收和功能完成状态 |
| scripts/lib/social-image.mjs | 各页 OG / Twitter 分享图 | 模式配色生成图 | 六项目配色；主要入口使用 V2 人物分享图 |
| assets/brand/*.svg、favicon | 导航、小图标、品牌标记 | 已有独立矢量标记，未使用人物头像 | 审核后沿用与身份一致的矢量标记；补充紫藤意象 |
| assets/images/brand 历史母版和旧派生 | 本地来源记录与历史验证 | 包含早期人物；部分装饰仍现用 | 人物不再公开引用；历史资源保留，打包排除旧人物 |

本次不采用原 01_hero 版面切片，以免混入文字/色板；不把低分辨率场景放大成横幅。
