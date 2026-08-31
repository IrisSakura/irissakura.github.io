# Consumer Lab 推送同步

Consumer Lab 当前登记七个公开 Case，其中四个 Consumer Repository 启用 source-push，另外三个
保留经复核的固定快照。启用同步的仓库在 `main` 推送时产生脱敏技术投影；个人站导入投影、运行完整构建，
再以普通 fast-forward 提交触发既有 GitHub Pages 工作流。个人站不保存消费者 Gitea 地址、凭据
或源码镜像，Pages artifact 也不包含 `data/consumer-lab.json`。

Case、Repository 与代表性公开证据的关系由 owner-only `config/consumer-sync.json` 统一登记；
生成器要求 source-push 与 fixed-snapshot 两组 ID 精确覆盖所有 Case，禁止用“七个项目”和“四个仓库”
指代同一概念。

## 所有权边界

消费者投影只允许包含：

- 消费者稳定 ID、固定提交 SHA 与提交时间；
- Unity 版本、Framework exact SHA 与 Framework 包名集合；
- `local-passed / runner-pending` 状态；
- Node、EditMode、PlayMode 与本地 Player 的通过边界。

站点继续独占 `title`、`category`、`summary`、`highlights`、`capability` 与证据边界文案。
导入器不会接受也不会改写这些字段。公开 Portfolio 只渲染项目名、类型、摘要和四条核心系统，
不渲染 SHA、包集合、测试计数、数据来源或证据治理信息。

## 证据新鲜度与复核

导出器从目标 Git 提交读取 `Packages/manifest.json`、`ProjectSettings/ProjectVersion.txt` 和
`evidence/<framework-sha>/` 下的 canonical EditMode / PlayMode XML。两个 XML 必须完整通过，
所有 Framework 根必须指向同一个 40 位提交。

导出器还会比较 XML 最后提交与目标提交。如果其后改动过 `Assets/`、`Packages/` 或
`ProjectSettings/`，同步失败并要求重新生成、提交 Unity 证据。README、同步配置或工作流变更
不冒充产品变化，可以幂等前进。

`reviewedPackageHash` 冻结每个案例已复核的包集合。普通提交、Framework SHA、Unity 版本和通过
计数可以自动更新；新增或移除 Framework 包时导入失败，站点维护者必须先复核访客摘要和核心系统，
再更新该 hash。相同消费者提交若出现不同技术事实、或时间更旧的投影，也会被拒绝。

## Consumer Runner 配置

每个消费者 Gitea 仓库需要：

- 一个仅提供 `consumer-site-sync` 标签的专用 owner/repository Runner；不要把现有 Framework 或
  Journal 的仓库级 Runner 改成全局 `game-ci` 执行面；
- `WEBSITE_GITHUB_SSH_KEY`：只对 `IrisSakura/irissakura.github.io` 具备写权限的专用 SSH key；
- `WEBSITE_GITHUB_KNOWN_HOSTS`：预先审核的 `github.com` host key；
- 私有 checkout 使用 Gitea 为当前 job 自动签发的 `${{ secrets.GITEA_TOKEN }}`，工作流以
  `permissions: contents: read` 将其收紧为当前仓只读，并使用 `${{ gitea.actor }}` 作为用户名；
  不创建或保存长期用户 PAT；
- 仅当 Runner 缺少标准 Gitea 仓库上下文时，设置 `CONSUMER_REPOSITORY_URL` 变量。

工作流固定使用 `git@github.com:IrisSakura/irissakura.github.io.git`，不探测 HTTPS 或 GitHub CLI
身份。Secret 缺失时明确失败，不降级到不安全 transport。

## 写入与并发策略

消费者同步只能修改：

- `data/consumer-lab.json`；
- 由同一次生成产生的 `pages/portfolio.html`。

`scripts/verify-consumer-sync-scope.mjs` 会拒绝其他路径。每次尝试都从网站最新 `main` 新克隆，
运行导出、导入幂等检查、完整 `npm run check` 与缓存空白检查，然后普通 push。若多个消费者或
Journal 同时写入网站，非快进 push 会触发最多三次全新克隆重试；三次仍冲突则失败关闭，绝不
force push，可用源仓 `workflow_dispatch` 重跑。

## 本地复现

在本站执行：

```bash
npm ci
npm run consumer:export -- --source /path/to/consumer --commit <consumer-sha> --output /tmp/consumer.json
npm run consumer:import -- --input /tmp/consumer.json
npm run consumer:check -- --input /tmp/consumer.json
npm run check
node scripts/verify-consumer-sync-scope.mjs
```

如果只需验证当前站点是否已同步，使用 `consumer:check`；不要手工复制私有 manifest URL 或把
`data/consumer-lab.json` 加入 Pages artifact。
