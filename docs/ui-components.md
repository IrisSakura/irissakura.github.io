# UI 组件与设计 Token

本站继续使用静态 HTML、TypeScript 和原生 CSS。常用界面组件采用“语义类 + 共享 token + 页面变体”的轻量组件层，不要求生成器输出某个前端框架的工具类，也不依赖 JavaScript 才能获得基础视觉。

## 层级与所有权

1. `style/main.css` 定义 `--ui-*` token 和共享组件行为。
2. `style/pastoral.css`、`style/sakura-village.css` 只为主题赋值 token，并保留纯氛围装饰；不重新实现 `.btn`、picker 或 tag 基类。
3. 页面 CSS 负责网格、内容密度和有语义的变体，并通过 token 获取 surface、边框、控件、chip 与焦点状态。
4. `src/site.ts` 的 `DEPTH_SELECTOR` 只增强动效；基础表面和可访问状态必须在无 JavaScript 时仍成立。

## 常用组件

| 组件 | 语义类 | 统一项 | 页面可变项 |
| --- | --- | --- | --- |
| 操作按钮 | `.btn` + `.btn-primary/.btn-secondary/.btn-outline` | 字体、圆角、颜色、边框、hover 阴影 | 排列、宽度 |
| 选择控件 | `.theme-picker` | 44px 高度、边框、surface、图标、hover/focus | 导航中的宽度 |
| 分段筛选 | `.module-filters/.module-filter` | 控件高度、surface、边框、active/focus | 列数 |
| 标签 | `.tag`、`.note-tags`、`.system-tags`、`.portfolio-tags` | chip 边框、圆角、surface、文字 | 内边距、字号、间距 |
| 内容表面 | blog/journal/module/game 等语义 card | surface 与弱边框 | 布局、padding、主题形状 |

新增组件时优先复用 `--ui-surface-*`、`--ui-border-*`、`--ui-control-*`、`--ui-action-*`、`--ui-chip-*` 和 `--ui-focus-*`。只有新的交互语义确实无法表达时才增加 token；不要为单个页面复制一套 hover/focus 颜色。

## 市面组件库评估

- **Bootstrap**：CSS 变量和色彩模式成熟，但 `.container`、`.btn` 等类会与本站现有类直接冲突，引入后需要迁移主题和大量页面结构。
- **Pico CSS**：适合以语义元素和表单默认样式起步的新站；其全局元素规则会覆盖本站已有排版和容器体系。
- **Tailwind**：可建立严格 token，但需要扫描生成 HTML/模板并增加 CSS 构建链，也会把当前语义类迁成大量工具类。
- **Web Awesome**：命名隔离的 Web Components 与无框架架构最匹配，适合作为未来 dialog、menu、tooltip 等复杂交互的候选；现阶段按钮、卡片、标签和原生 select 不值得为此增加组件运行时与 Shadow DOM 主题映射。

当前不安装整套 UI 库。未来需要复杂交互时，优先对 Web Awesome 做按需单组件试点：固定版本、本地打包、映射三主题 token、验证键盘与 reduced-motion，并保持可独立撤回。
