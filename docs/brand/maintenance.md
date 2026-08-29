# IrisSakura Brand Maintenance

## 新页面

先在 `config/brand.json.pageModes` 为页面职责选择 `master`、`iris`、`sakura`、`journal` 或 `game`。在 generator 的页面定义中使用稳定 key，让 `<html data-brand-mode>`、theme-color、Social Card palette 和体验层自动继承。未知 mode、缺失 mode、丢失资产或公开命名漂移必须失败关闭，不允许静默回退。

内容按 Value → System → Result → Evidence → Boundary → Next 审阅。真实状态、成熟度和限制继续来自现有 owner data；品牌文案不得把 Planned 写成 Implemented、Implemented 写成 Verified、Prototype 写成 Release，或暴露私有地址、本机路径与凭据。

## 更新资产

官方 SVG 位于 `assets/brand/`。Logo、Wordmark、Product Lockup、Icon Sprite 和 README Header 的路径由 `config/brand.json.assets` 管理。替换文件时保持 viewBox、`title`、`desc`、无远程依赖，并在桌面、移动与深浅背景上检查。favicon 继续使用 symbol only；导航使用 symbol + wordmark；Engineering 与 Framework 可使用各自 Product Lockup；Brand 页面只展示必要样例，不变成素材仓库。

## 验证与交付

品牌修改至少运行 `npm run build`、`npm test`、`npm run test:brand`、`npm run test:smoke` 与 `npm run package:site`。另外检查 Social Card 1200×630、公开命名、SEO theme-color、键盘、focus-visible、WCAG 对比度、mobile nav、reduced motion、水平溢出、隐私和生成幂等。提交、推送、Runner、Release 与发布是独立授权，不因本地检查通过而自动执行。

## 季度品牌审计

每季度检查命名漂移、页面职责混淆、子品牌视觉过度趋同、品牌元素过量、新产品未归类、Evidence 表达过量，以及官方资产是否仍在实际入口使用。审计结论只能建议下一步，不能自行扩大产品或发布范围。

## 每月站点检查

每月检查 broken links、stale project status、old screenshots、SEO、Social Card、Framework maturity、Journal curation 与 Navigation。数据更新必须继续通过各自 owner export/import 与固定提交边界，不能为了品牌一致性手改生成投影或扩写未验证事实。
