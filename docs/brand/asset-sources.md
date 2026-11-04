# 站点视觉资产来源与输出

本页给维护者定位可编辑母版、既有来源记录和派生文件。资产事实和哈希以所链接的配置与 manifest 为准，公开页面由站点生成器负责。

| 资产家族 | 可编辑输入与事实源 | 派生记录、输出与采用位置 |
| --- | --- | --- |
| Six Flower Personas V2 | [`config/personas-v2.json`](../../config/personas-v2.json) 定义身份、颜色、母版哈希与使用路由；各角色母版位于 `assets/personas/v2/<id>/master/character.png` | [`scripts/build-personas-v2.py`](../../scripts/build-personas-v2.py) 从母版派生 WebP/AVIF；[`assets/personas/v2/manifest.json`](../../assets/personas/v2/manifest.json) 记录文件与哈希；当前采用范围看[使用清单](personas-v2/PERSONA_V2_USAGE_INVENTORY.md)和[迁移映射](personas-v2/PERSONA_V2_MIGRATION_MAP.md) |
| 站点图标 V2 | [`site-icon-v2/source.png`](site-icon-v2/source.png)、[来源 manifest](site-icon-v2/manifest.json) | [`site-icon-v2/export.py`](site-icon-v2/export.py) 派生到 [`assets/brand/site-icon-v2/`](../../assets/brand/site-icon-v2/)；具体图标文件和哈希以 manifest 为准，公开引用由站点模板和配置维护 |
| Creator vignettes | [`creator-vignettes-v1/manifest.json`](creator-vignettes-v1/manifest.json) 逐场景记录 source、输出、转换参数和 route | [`assets/images/decorative/creator-vignettes-v1/`](../../assets/images/decorative/creator-vignettes-v1/) 的 WebP；阅读、游玩和信件分别用于 manifest 指向的 Blog、Portfolio、Contact 路由 |
| project-chibis V1 与 site-v2 项目题图 | [project-chibis V1 说明](project-chibis-v1/README.md)、[`site-v2` manifest](../../assets/images/brand/site-v2/manifest.json) | project-chibis V1 保留作历史记录；根 README 当前将四个项目首屏映射到 site-v2 题图。角色图的当前采用与迁移范围另看 Persona V2 使用清单 |

页面源由 [`scripts/generate-site.mjs`](../../scripts/generate-site.mjs) 生成，生成后的 HTML 不手工维护。分享图由站点生成过程放在 ignored `.generated/social/`，[`scripts/prepare-pages.mjs`](../../scripts/prepare-pages.mjs) 将准入内容打包到 `_site/`；TypeScript 编译结果在 `dist/`。这些输出按根 [README 的构建与发布流程](../../README.md#构建与验证)读取，不能由本页推断已部署。未在上述配置或 manifest 证实的单张图像上游来源与授权关系，仍需逐件核实。
