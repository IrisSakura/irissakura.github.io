# Persona V2 网站实施报告

日期：2026-09-22。范围：个人网站全部相关页面。基线：`f32cc68275ea05f085d637652b2f30d6c5e54079`。

## 已实现

- 首页、项目总览与品牌页展示六个角色及对应项目；About / Contact、共享页脚提供六项目入口。
- Engineering、Framework、Myosotis、Violet Shelf、Freesia Mods 使用新透明人物，新增 Wisteria 介绍页。Wisteria 保留「正在制作中、暂未开放下载」的真实状态。
- 六个人物分别使用工程网格、斜向模块、书页、工具架、开放弧线、紫藤拱门的背景意象。人物与文字独立布局，移动端完整等比展示。
- 引入六项目色板及六张分享图；139 个 HTML 输出统一更新共享样式、导航、页脚和适用元数据。
- 六份 1086 × 1448 RGBA 母版逐字节保留。新增 36 张 AVIF/WebP（360、720、1086 三档）、6 张 1200 × 630 分享图。首屏图片优先加载，其余懒加载，提供显式尺寸、响应式 source 和适当的 alt。
- 旧矢量标记保留识别结构；补充 Wisteria 花卉标记。原有创作者品牌、技术 ID、游戏截图、知识正文及项目事实不变。
- 修正验收发现的 768px 工程证据卡横向溢出；调整项目总览长标题字号。

## 文件与来源

- [修改文件、新资产和历史归档清单](files.json)
- [六角色数据源](../../../config/personas-v2.json)
- [派生资源哈希清单](../../../assets/personas/v2/manifest.json)
- [迁移映射](PERSONA_V2_MIGRATION_MAP.md)
- [使用调查](PERSONA_V2_USAGE_INVENTORY.md)

`files.json` 是本批次文件清单，排除任务开始前已经存在的三个未跟踪规划文件。历史人物仍在原来源目录保存，发布目录排除 V1、旧 site-v2 人物和新 PNG 母版；仍在使用的 Freesia 花卉装饰保留。历史目录 README、测试及维护记录里的旧路径是存档引用，不是公开人物引用。

## 维护入口

常规内容修改仍运行 `npm run build`，由生成器统一写入 HTML。人物源、配色或派生规格变更时，先用支持 AVIF 的 Pillow 运行 `python3 scripts/build-personas-v2.py`，然后执行常规构建与验收。不要直接修改生成 HTML 或 CSS token 文件。

本次没有修改其他项目仓库，没有提交、推送或发布。项目 README、文档和应用内视觉依用户选择留待后续独立范围。
