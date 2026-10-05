# IrisSakura Site Icon V2

2026-10-05：按用户要求将网站旧花卉几何图标更新为符合现有插画风格的 ACG Q 版创作者头像。

通过内置 ImageGen 生成新的透明底近景构图，以 `creator-vignettes-v1/playing.png` 作为人物身份和画风参考。银发、紫瞳、淡紫卫衣、侧边蝴蝶结与樱花发饰保持网站已有形象；简化发丝、强化深紫轮廓，使小尺寸图标仍能辨认。文字标、各项目独立图标和个人资料头像保持各自用途。

导航和页脚使用 128px PNG；浏览器标签使用 16px / 32px PNG；Apple Touch 使用 180px PNG；Web App Manifest 使用 192px / 512px PNG，声明 `purpose: any`，不声明未经专门设计的 maskable 适配。所有导出保留透明度。

源图保存在本目录，发布图保存在 `assets/brand/site-icon-v2/`。运行 `export.py` 可重新导出；尺寸、文件大小和 SHA-256 见 `manifest.json`。`config/brand.json.assets` 管理消费路径，页面和 Web App Manifest 由站点生成器统一生成。使用版本化路径替换旧图标引用，避免沿用旧缓存。

## Generation prompt

Use case: stylized-concept. Asset type: one square website identity icon for IrisSakura, used for favicon, bookmark/app icon, navbar and footer mark. Reference image: the supplied current creator illustration is ONLY a character identity and illustration style reference. Create a NEW dedicated icon composition, not a crop and not the whole-body scene. Subject: the same adorable silver-white haired ACG chibi creator girl with gentle lavender eyes, a tiny confident calm smile, very subtle blush, a lavender side ribbon and a simple single violet iris / blush sakura petal hair ornament. Head-on almost symmetrical head-and-small-shoulders closeup, enormous head filling 88 percent of square with a clear silhouette and readable eyes. Chin and small lavender hoodie shoulders at the bottom. Simplify fine hair strands greatly; large clean hair shapes, thick elegant deep iris-purple anime contours, restrained 2-tone cel shading, soft white/lavender/iris-purple with a very small blossom-pink accent. Must match the reference's delicate calm ACG chibi personality but function as a crisp recognizable compact icon at 32px. Keep all head/hair inside canvas with about 5 percent transparent margin; no cropped top of head. Isolated on genuine transparent background. No text, no letters, no monogram, no gamepad, no hands, no props, no full body, no additional floating sparkles, no decorative frame, no photographic realism, no 3D, no watercolor. Single finished icon only, not a contact sheet.
