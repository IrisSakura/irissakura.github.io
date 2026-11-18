# Iris Engineering 推送同步

Iris Engineering 的 `main` push 是 Engineering 公开快照的 source event。源仓从 exact event commit 读取 checked-in `config/public-site-profile.json`，生成只有 manifest 与公开 payload 的确定性导出；个人站验证后以普通 fast-forward 提交触发既有 Pages 工作流。

## 真理源与隐私分层

- Iris `config/public-site-profile.json` 拥有公开状态、能力、证据与边界语义；
- export `manifest.json` 保存 source SHA、commit time、payload SHA-256 与 bytes，只在同步进程中流转；
- 本站 `config/iris-engineering-sync.json` 保存同一 provenance，属于 owner-only config，不进入 `_site`；
- `data/iris-engineering.json` 是公开 schema v2，只增加 `sourceUpdatedAt`，不包含 source SHA；
- 工程页的能力与执行规则读取源快照。其他项目页面使用本站维护的稳定 Iris 链接文字与目标锚点；
- 首页、作品与项目地图的入口文案，以及工程页的操作截图，由本站维护。截图取自实际 Iris 界面，使用隔离的演示项目和账户。

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

- checkout 使用 Gitea Actions 提供的 `gitea.token` 与 `gitea.actor`；
- 可选 variable `IRIS_ENGINEERING_REPOSITORY_URL`，缺省使用事件仓库的 HTTP(S) 克隆地址；
- secret `WEBSITE_GITHUB_SSH_KEY`（只对个人站仓库具有写权限的专用 Deploy Key）；
- secret `WEBSITE_GITHUB_KNOWN_HOSTS`（固定 GitHub host key）。

workflow 从网站最新 `main` 记录 `BASE_SHA`，完整导入/生成/检查后显式暂存五条路径，push 前再次 fetch；远端已前进时失败并要求重跑，不自动 merge、不 force push。相同 source commit 的安全重放若无差异则正常 no-op。

工作流文件、本地测试或本地隔离演练都不证明外部同步已启用。Secret/Runner 配置、Iris/网站提交推送、首次 Gitea run、GitHub commit 与 Pages 可见结果需要分别授权并记录 exact SHA/attempt 证据。

## 2026-11-18 同步复现

源提交 `7371a8def7` 在第 49 次运行中已完成 checkout、导出和导入，个人站生成器仍要求早期外部读取试点的 `failed-closed` 条目。当前生成器校验公开数据形状与隐私边界，具体证据内容由源资料维护。复验也确认跨项目链接不能直接渲染源快照中的可变标题，否则一次 Iris 更新会连带修改 Framework、游戏和 Journal 页面。[原始作业](https://git.irissakura.com/iris-engineering-lab/IrisEngineering/actions/runs/1777/jobs/3067)

在 `74065bc9` 的网站基线上复现原始失败。用新版网站和隔离源快照经正式导入及回读入口验证，站点检查与公开打包通过，五路径范围门禁接受三处更新。出图、同步重放与网站构建均在本机隔离环境执行。
