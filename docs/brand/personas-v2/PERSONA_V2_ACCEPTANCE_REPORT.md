# Persona V2 网站验收报告

日期：2026-09-22。验收对象为当前未提交工作树，不能仅凭基线 HEAD 复用本报告。

## 自动检查

| 检查 | 结果 |
|---|---|
| `npm run check` | 通过：JSON、来源契约、生成、TypeScript、品牌契约、201 项单元测试、139 个 HTML 页面与本地链接 |
| 最终布局复核 | 通过：最终标题样式下 10 页面 × 4 尺寸，共 40 组；截图与布局 JSON 已保存 |
| `npm run package:site` | 通过：生成 `_site` 本地发布目录 |
| `npm run test:smoke` | 通过：完整路由、持久导航、主题切换、静态搜索、阅读入口、证据链、移动菜单与联系入口 |
| 母版与原始素材 SHA-256 | 六份一致，尺寸及 RGBA 保持不变 |
| 发布资源 | 六主要页面共 42 处响应式文件引用存在，6 张 OG 图与人物分享源文件一致 |
| 旧资源排除 | 发布目录不含旧 V1 / site-v2 人物目录、新 PNG 母版 |
| 原有工作保护 | findings.md、progress.md、task_plan.md 的 SHA-256 与任务基线一致 |
| `git diff --check` | 通过 |

## 视觉证据

浏览器检查覆盖首页、项目总览、品牌页、六项目页和 Contact，宽度为 390、768、1440、2560；另有四主要项目在 390、899、900、901、1440 的导航遮挡、锚点跳转与知识检索区布局检查。

截图与布局记录保存于本地 `.generated/personas-v2-acceptance/`，不进入发布目录。人物使用 `object-fit: contain`，所有响应式变体保留完整画幅。四项视觉测试分别观察小尺寸识别、模糊后的色块、纯黑轮廓和隐藏文案后的身份差异，不将程序检查等同于人工审美结论。

### 人工视觉复核

- Thumbnail：六人物在约 190px 卡片中仍保留完整姿势与主要色块。
- Blur：Iris / Myosotis 同属蓝系，但垂直工程姿态与宽幅坐姿、底色明显不同；其余四角色有独立色块。
- Silhouette：站立、展开、坐姿、支撑、外展与落地裙摆保持差异；未把角色裁成同类头像。
- Content-Off：隐藏文字后，颜色、轮廓和六种背景意象仍能区分入口。
- Desktop / Tablet / Mobile：标题、按钮与人物分别占位；小屏人物在文字下方，需正常滚动查看全身，未通过裁切塞入首屏。

| 证据 | 本地文件 |
|---|---|
| 六项目总览 | [截图](../../../.generated/personas-v2-acceptance/personas-six-cards.png) |
| Desktop | [工程页 1440px](../../../.generated/personas-v2-acceptance/persona-engineering-1440.png) |
| Tablet | [框架页 768px](../../../.generated/personas-v2-acceptance/persona-framework-768.png) |
| Mobile | [Wisteria 390px](../../../.generated/personas-v2-acceptance/persona-wisteria-390.png) |
| Thumbnail / Blur | [缩略图](../../../.generated/personas-v2-acceptance/personas-thumbnail.png) · [模糊](../../../.generated/personas-v2-acceptance/personas-blur.png) |
| Silhouette / Content-Off | [轮廓](../../../.generated/personas-v2-acceptance/personas-silhouette.png) · [隐藏文案](../../../.generated/personas-v2-acceptance/personas-content-off.png) |
| 40 组布局数据 | [JSON](../../../.generated/personas-v2-acceptance/personas-layout.json) |

## 失败记录与修复

- 旧单测 fixture 缺少新增六人物输入：补齐真实配置，受影响 6 项及最终全套 201 项通过。
- 768px 工程页证据卡溢出 30px：网格列改用 `minmax(0, 1fr)`，卡片允许收缩和长内容换行。
- 浏览器主题色断言仍是旧 Sakura 色板：对齐新公开色板，保留导航状态与深色背景对比度检查。
- 一次浏览器运行与生成步骤重叠读到临时页面：结束生成后重新执行稳定输出验收，该次失败不计为有效通过证据。

## 本地日志

[完整检查](../../../.generated/personas-v2-acceptance/check.log) · [浏览器回归](../../../.generated/personas-v2-acceptance/browser.log) · [打包](../../../.generated/personas-v2-acceptance/package.log)。结果为 local-passed；未提交、未推送、未发布。

## 边界

公开 HTML 不再引用旧项目人物；源目录与历史验证仍保留旧资料。本次仅完成个人网站，其余仓库及应用内视觉未迁移。浏览器为本地 Chromium，未执行 Safari、Firefox 或真实设备验收；没有进行线上发布或线上 CDN 验收。
