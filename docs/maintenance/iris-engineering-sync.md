# Iris Engineering 推送同步

Iris Engineering 的 `main` push 是 Engineering 公开快照的 source event。源仓从 exact event commit 读取 checked-in `config/public-site-profile.json`，生成只有 manifest 与公开 payload 的确定性导出；个人站验证后以普通 fast-forward 提交触发既有 Pages 工作流。

## 真理源与隐私分层

- Iris `config/public-site-profile.json` 拥有公开状态、能力、证据与边界语义；
- export `manifest.json` 保存 source SHA、commit time、payload SHA-256 与 bytes，只在同步进程中流转；
- 本站 `config/iris-engineering-sync.json` 保存同一 provenance，属于 owner-only config，不进入 `_site`；
- `data/iris-engineering.json` 是公开 schema v2，只增加 `sourceUpdatedAt`，不包含 source SHA；
- 首页排序、品牌语气、项目因果链和其他站点策展仍由本站拥有。

公开 data、HTML 和 Pages artifact 禁止 Gitea URL/IP、私有 repository identity、本机路径、Git transport、credential、deploy key、Runner identity、内部 evidence hash、`remote-matched` 和 exact source SHA。

## 本地复现

先在 Iris Engineering fixed checkout 中导出：

```bash
npm run public-site:export -- \
  --commit <exact-source-sha> \
  --output /tmp/iris-engineering-public-export
```

再在本站导入、验证、生成并检查范围：

```bash
npm run engineering:import -- \
  --input /tmp/iris-engineering-public-export \
  --source-repository /absolute/path/to/fixed-iris-checkout
npm run engineering:check -- \
  --input /tmp/iris-engineering-public-export \
  --source-repository /absolute/path/to/fixed-iris-checkout
npm run check
node scripts/verify-engineering-sync-scope.mjs
```

importer 只接受包含 `manifest.json` 和 `iris-engineering.json` 的普通目录，要求 source checkout `HEAD` 等于 manifest SHA。已有 provenance 与 incoming SHA 不同时，必须能证明前者是后者的 Git ancestor；旧提交、旁支、同 SHA hash drift、篡改、额外文件或未知字段均失败关闭。

## Owner scope

每次 Bot 同步只能修改：

```text
config/iris-engineering-sync.json
data/iris-engineering.json
index.html
pages/engineering.html
pages/portfolio.html
```

人工维护的 importer、model、tests、package scripts、Brand Contract、CSS 和其他页面不属于 Bot owner scope。`scripts/verify-engineering-sync-scope.mjs` 会拒绝任何额外 tracked/untracked path；workflow 使用同一五路径显式 `git add --`，不使用 `git add -A` 或 force push。

## 外部启用

源仓 Gitea workflow 需要下列最小配置：

- variable `IRIS_ENGINEERING_REPOSITORY_URL`；
- variable `IRIS_GITEA_USERNAME`；
- secret `GITEA_TOKEN`（只读 source checkout，若仓库要求认证）；
- secret `WEBSITE_GITHUB_SSH_KEY`（只对个人站仓库具有写权限的专用 Deploy Key）；
- secret `WEBSITE_GITHUB_KNOWN_HOSTS`（固定 GitHub host key）。

workflow 从网站最新 `main` 记录 `BASE_SHA`，完整导入/生成/检查后显式暂存五条路径，push 前再次 fetch；远端已前进时失败并要求重跑，不自动 merge、不 force push。相同 source commit 的安全重放若无差异则正常 no-op。

工作流文件、本地测试或本地隔离演练都不证明外部同步已启用。Secret/Runner 配置、Iris/网站提交推送、首次 Gitea run、GitHub commit 与 Pages 可见结果需要分别授权并记录 exact SHA/attempt 证据。
