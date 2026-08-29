# IrisSakura Iconography

## 两类图标

GitHub、Email、Menu、Close、External link 与 Search 等通用操作继续使用 Font Awesome，避免重复发明已有交互符号。品牌核心概念使用 `assets/brand/icons.svg` 中的独立 SVG symbol；它们采用一致的 24×24 viewBox、圆角线端、1.7 stroke 与 `currentColor`，可继承对应 Brand Mode 的语义色。

IRIS 首批八个概念是 Engineering、Workflow、Pipeline、Automation、Reliability、Verification、Project、Delivery。它们偏矩形、箭头、轨道、步骤与确定节点。SAKURA 首批八个概念是 Framework、Runtime、Gameplay、Module、Tooling、Extension、Composition、Integration。它们偏分枝、层叠、组合与可扩展连接。

共享六个概念是 Research、Game、Evidence、Experiment、Consumer、Architecture。共享图标只表达跨产品对象，不把 Consumer Lab 或游戏重新命名成 Iris/Sakura 产品。

## 使用方式

HTML 使用 `<svg aria-hidden="true"><use href="../assets/brand/icons.svg#iris-pipeline"></use></svg>`。有可见文本时图标保持装饰性；没有可见文本时必须给外层链接或按钮提供可访问名称。核心概念不能用 Font Awesome 临时替代后又继续扩散；新增 symbol 需要同步更新 Brand Contract 测试和本文件。Social Card 由 mode palette 与确定性模板生成，不直接截取网页图标。
