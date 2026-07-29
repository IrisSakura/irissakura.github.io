# Journal 推送同步

Sakura Design Journal 的 `main` 分支推送负责生成公开导出包，并通过 SSH 把确定性结果
提交到本站 `main`。本站永远不持有 Journal 仓库凭据，也不在构建阶段访问私有仓库。

## 发布边界

- `game-designs/catalog.v1.json`：公开标题、摘要、标签、稳定 ID、更新时间和内容哈希；
- `diary/`：只公开执行摘要、总体结论或审计结论；包含私密模式时改用通用摘要；
- `blogs/publication.v1.json`：登记文章公开完整 Markdown；
- 未提交文件、未登记博客、Godot 笔记、审计全文和设计正文不会进入导出。

Journal 端先固定触发提交并生成 `journal-source.json` 与 `blogs/*.md`。本站导入器随后重新
校验 SHA、数量、正文哈希和敏感内容，再生成 HTML。Markdown 产生的 HTML 还会经过
白名单清理。

## Runner 配置

在 Journal 的 Gitea 仓库中配置：

- `WEBSITE_GITHUB_SSH_KEY`：只对 `IrisSakura/irissakura.github.io` 具备写权限的 SSH
  私钥，推荐使用该仓库专用 deploy key；
- `WEBSITE_GITHUB_KNOWN_HOSTS`：预先审核的 `github.com` host key 行；
- 原有 Journal checkout 所需的 `GITEA_TOKEN`、`IRIS_GITEA_USERNAME` 和
  `SAKURA_DESIGN_JOURNAL_REPOSITORY_URL`。

工作流固定使用 `git@github.com:IrisSakura/irissakura.github.io.git`，不探测 HTTPS
或 GitHub CLI 身份。

## 写入与冲突策略

同步提交只能修改：

- `data/journal.json`、`data/journal-source.json`；
- `content/blogs/`；
- `pages/blog.html`、`pages/blog/`、`pages/journal.html`；
- 因计数或链接变化而生成的 `index.html`、`pages/portfolio.html`、`sitemap.xml`。

`scripts/verify-journal-sync-scope.mjs` 会拒绝其他路径。工作流在提交前运行完整站点检查和
`git diff --cached --check`，只做普通 fast-forward push，绝不 force push。

如果本站 `main` 在同步期间发生变化，工作流会失败并保留远端内容。使用
`workflow_dispatch` 重新运行；不要扩大路径白名单或改成 force push 来绕过冲突。

## 本地复现

在 Journal：

```bash
node tools/docs/public-site-export.mjs generate --commit <journal-sha> --output /tmp/journal-public
```

在本站：

```bash
npm ci
npm run journal:import -- --input /tmp/journal-public
npm run journal:check -- --input /tmp/journal-public
npm run check
node scripts/verify-journal-sync-scope.mjs
```
