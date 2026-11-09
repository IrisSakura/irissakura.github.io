# Source-push 项目状态同步

Iris Shelf 与 UDGAP 通过各自 Gitea 私有仓库的 `main` push 驱动个人站项目状态。两个源仓共享 schema 语义，不共享 Runner credential、source repository token 或 provenance。

## Source owner

每个源仓版本化维护 `config/public-site-project.json`。exporter 只从 exact Git commit 读取 regular blobs，产生：

- `manifest.json`：owner-only source/profile commit、canonical time、payload SHA-256 与 bytes；
- `<project-id>.json`：公开项目状态，不包含 Git SHA、remote、本机路径、Secret 或用户运行状态。

visible `updatedAt` 和 `lastReviewedAt` 来自 profile 文件最后一次 committed change。无关源码提交仍会推进 owner provenance，但不会伪造新的公开事实日期。

## Site owner

站点入口：

```bash
npm run project:import -- --project <iris-shelf|udgap> --input <absolute-export> --source-repository <absolute-fixed-checkout>
npm run generate
npm run project:check -- --project <iris-shelf|udgap> --input <absolute-export> --source-repository <absolute-fixed-checkout>
node scripts/verify-public-project-sync-scope.mjs --project <iris-shelf|udgap>
```

importer 校验 closed manifest/payload、hash/bytes、固定 checkout、profile ancestry、source ancestry、same-commit drift、项目 identity、日期和隐私模式。它只替换 `data/projects.json` 中同 id 的一项并写入 `config/project-sync/<id>.json`；generator 重建 Portfolio。

每次 source sync 只允许：

- `config/project-sync/<id>.json`
- `data/projects.json`
- `pages/portfolio.html`

未知项目、side branch、stale update、额外 export file、scope 越界或网站 `main` 在验证后前进时失败关闭。workflow 只执行 normal fast-forward push。

## Execution and credentials

Shelf 与 UDGAP 复用 `IrisSakura` owner-level `consumer-site-sync` Runner。私有源 checkout 使用 Gitea 内置短生命周期 token；每个仓库单独保存 `WEBSITE_GITHUB_SSH_KEY` 与 `WEBSITE_GITHUB_KNOWN_HOSTS`。不得读取、复制或复用 Iris Engineering repository-scoped Runner credential。

UDGAP checkout 设置 `GIT_LFS_SKIP_SMUDGE=1`，同步只验证 committed project metadata；它不构成 Unity、Player、玩法或 Runner 测试证据。

## Plastic boundary

言铸之剑没有 Git ancestry，当前保持 `site-curated`。在 Plastic workspace 可提供 live changeset/head、固定 blob 读取和可审计 after-checkin trigger 之前，不得把 Git importer 或 source-push 标签套用到该项目。

## Violet 来源迁移恢复记录

2026-11-09，维护者要求修复并分别提交推送四项已定位工作流问题。Violet 临时目录修复后，远端运行 1744 继续被旧来源 ancestry 拦截。网站仍记录不可解析的旧提交 `2d18a7de`，此前获批的新基线 `281a0af5` 保存在本站本地提交 `a40329a6`，尚未交付到网站 main。

本次核对当前源仓完整历史，确认 `281a0af5` 是修复提交 `8f5fad28` 的祖先。正式 exporter 的 profile commit、payload SHA-256 与字节数均与此前获批迁移一致。按本次修复及推送授权补交一次性基线迁移，再由原 importer 正常推进到 `8f5fad28`。旧来源和原项目条目保存在[迁移归档](source-migrations/iris-shelf-2026-11-09.json)，普通同步继续校验 ancestry、same-commit drift 和三路径范围。
