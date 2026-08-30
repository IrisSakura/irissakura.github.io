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
