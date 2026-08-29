# IrisSakura Page Modes

页面模式是同一主品牌下的职责表达，不是可供访客切换的多个主题。权威映射位于 `config/brand.json.pageModes`，生成器对未知或缺失 mode 失败关闭，并把 mode 写入 `<html data-brand-mode>`。

## Master Mode

用于首页、作品、Brand、联系和系统兼容页。颜色让 IRIS 蓝紫与 SAKURA 粉青平衡出现；几何同时使用分栏和柔和圆角；图案表现交汇；信息密度保持编辑式中性；Motion 是克制的合流和淡入。

## Iris Mode

用于 Engineering。Color 为蓝紫控制面，Geometry 使用矩形、轨道、节点和编号，Pattern 为正交网格，Icon 使用 pipeline / workflow 语义，Layout density 更紧凑，Motion 使用短时长的线性横向推进。模式不能暗示任何未取得的外部平台或 Runner 证据。

## Sakura Mode

用于 Framework 和 Quickstart。Color 为薄荷青、青绿与轻花色，Geometry 使用圆角层叠、分枝与组合簇，Pattern 为径向节点，Icon 使用 composition / framework 语义，Layout density 更舒展，Motion 使用 soft expand、branch 与 layer reveal。

## Journal Mode

用于 Journal、Blog 和研究详情。Color 为墨梅、纸玫瑰和安静青色，Geometry 模拟编辑栏与批注边缘，Pattern 为基线纸与引用标记，Icon 使用 research，Layout density 适合长文，Motion 是安静淡入。

## Game Mode

游戏保留自己的 Color、Geometry、Pattern、Icon、density 与 Motion。个人品牌只出现在共享导航、页脚和小型技术生态署名；不得给真实截图强制染色，也不得在游戏 Hero 上叠加技术 mode signature。
