# UI 组件与设计 Token

本站继续使用静态 HTML、TypeScript 和原生 CSS。常用界面组件采用“语义类 + 共享 token + 页面变体”的轻量组件层，不要求生成器输出某个前端框架的工具类，也不依赖 JavaScript 才能获得基础视觉。

## 层级与所有权

1. `style/main.css` 是稳定入口；`style/site.css` 声明样式分层，`style/tokens/` 定义颜色和尺寸，`style/components/` 定义共享组件。
2. `style/shell/site-shell.css` 拥有导航的布局及全部状态。品牌配色由 token 层提供，不重新实现 `.btn`、brand seal 或 tag 基类。
3. 页面 CSS 负责网格、内容密度和有语义的变体，并通过 token 获取 surface、边框、控件、chip 与焦点状态。
4. `src/site.ts` 的 `DEPTH_SELECTOR` 只增强动效；基础表面和可访问状态必须在无 JavaScript 时仍成立。
5. 通用标题与段落默认值属于 `base` 层。页面组合层不能通过 `[data-page-family] h3` 等宽泛规则覆盖组件标签、卡片标题与控件的字号。

## 常用组件

| 组件 | 语义类 | 统一项 | 页面可变项 |
| --- | --- | --- | --- |
| 操作按钮 | `.btn` + `.btn-primary/.btn-secondary/.btn-outline` | 字体、圆角、颜色、边框、hover 阴影 | 排列、宽度 |
| 主导航项 | `.nav-link` | 44px 最小高度、内边距、选中标识、hover/focus | 导航横排或竖排 |
| 分段筛选 | `.module-filters/.module-filter` | 控件高度、surface、边框、active/focus | 列数 |
| 标签 | `.tag`、`.note-tags`、`.system-tags`、`.portfolio-tags` | chip 边框、圆角、surface、文字 | 内边距、字号、间距 |
| 文字卡片 | `.content-card` + 内容语义类（如 `.writing-entry`），以及 `.module-detail` 语义别名 | 四边内边距、圆角、surface、边框、长词换行、首尾间距 | 内容排版、强调色、容器列数 |
| 专用内容表面 | blog/journal/module/game 等语义 card | 复用 surface 与弱边框 token | 有媒体分区等专用结构时保留独立布局 |

## 边界与状态约束

- 文字卡片以 `--ui-card-inset` 提供 20–28px 的连续内边距，以 `--ui-card-radius` 提供圆角。页面变体不能通过 `padding: ... 0` 清除左右留白；长标题和中英文混排必须在内容区域内换行。
- 主导航的选中线由左右相同的 `--nav-item-inset` 定位，不再同时设置 `width: 100%`。只有当前项显示选中线；悬停使用较浅背景，键盘焦点使用内置轮廓，三种状态可以同时出现但含义不同。
- 滚动或裁剪容器中的密集控件通过 `--ui-focus-inset-offset` 使用内置焦点轮廓，包括主导航、页内目录、分段筛选与全站搜索结果；不能依赖被父容器裁掉的外置轮廓表示焦点。
- 焦点轮廓的位置在普通控件状态即设置，避免 `transition: all` 在聚焦初始帧把轮廓从外侧移入，造成瞬时裁剪。
- 框架内容卡片共用安全换行规则，编号旁的正文使用 `minmax(0, 1fr)`；标题与版本号允许换行排列。内容网格在 600px 以下统一为单列，决策卡内分区按至少 15rem 的可读宽度自动换列。
- 包采用列表复用 `--ui-card-inset`，名称与包标识分列，说明另起一行；长标识在自身列内换行，窄屏改为单列。并排列表按顶部对齐，不把较短列表拉出没有内容的空白表面。
- `.depth-card` 只负责位移和阴影。需要独立卡片外观的内容必须在静态 HTML 中采用完整卡片组件，不能等动效运行时再补基础盒模型。
- 浏览器验收检查实际边界：桌面与窄屏的卡片内容均有留白，选中线不超出导航项，悬停其他项不会出现第二条选中线；同时保留真实导航点击与键盘焦点验证。
- 内容留白验收以卡片的内容盒为边界，文字进入声明的 padding 就算失败，不等到越过外框才报警。滚动表格、折叠内容与延迟渲染档案需在实际滚动或展开后另行检查，不能把离屏占位尺寸当成最终排版。

新增组件时优先复用 `--ui-surface-*`、`--ui-border-*`、`--ui-control-*`、`--ui-action-*`、`--ui-chip-*` 和 `--ui-focus-*`。只有新的交互语义确实无法表达时才增加 token；不要为单个页面复制一套 hover/focus 颜色。

## 市面组件库评估

- **Bootstrap**：CSS 变量和色彩模式成熟，但 `.container`、`.btn` 等类会与本站现有类直接冲突，引入后需要迁移主题和大量页面结构。
- **Pico CSS**：适合以语义元素和表单默认样式起步的新站；其全局元素规则会覆盖本站已有排版和容器体系。
- **Tailwind**：可建立严格 token，但需要扫描生成 HTML/模板并增加 CSS 构建链，也会把当前语义类迁成大量工具类。
- **Web Awesome**：命名隔离的 Web Components 与无框架架构最匹配，适合作为未来 dialog、menu、tooltip 等复杂交互的候选；现阶段按钮、卡片、标签和原生 select 不值得为此增加组件运行时与 Shadow DOM 主题映射。

当前不安装整套 UI 库。未来需要复杂交互时，优先对 Web Awesome 做按需单组件试点：固定版本、本地打包、映射三主题 token、验证键盘与 reduced-motion，并保持可独立撤回。
