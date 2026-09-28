# 可访问性基线

目标是按 [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) 检查主要内容和操作。已有的 Skip Link、焦点样式、语义标题、移动导航和 Reduced Motion 仍由共享样式与生成器维护。全站搜索使用原生 `dialog`、可见焦点、键盘上下选择、Enter 打开结果、Escape 关闭及触发点焦点恢复。

`npm run test:smoke` 用 axe-core 扫描首页、项目、博客、文章、Framework、Journal、联系页和搜索对话框，阻止 serious/critical 违规；同时检查键盘、移动搜索、无 JavaScript 阅读以及搜索失败回退。自动扫描通过不是完整符合性声明。上线前仍需人工检查颜色对比、内容图像替代文本、屏幕阅读器体验和文档要求的视口尺寸。
