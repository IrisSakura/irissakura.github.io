# UnityGameFramework 网站同步设计规格

**日期：** 2026-07-15  
**状态：** 待审阅  
**涉及仓库：** `IrisSakura/UnityGameFramework`、`IrisSakura/irissakura.github.io`

## 1. 背景

`UnityGameFramework` 的权威仓库位于云服务器 Gitea，GitHub 仓库只是镜像。个人网站仓库是公开 GitHub Pages 站点，目前框架页面使用静态 HTML 展示，框架数据不会随 Gitea 提交自动更新。

本设计建立一条单向发布链路：

```text
Gitea UnityGameFramework
  -> 镜像到 GitHub UnityGameFramework
  -> GitHub Actions 读取公开清单
  -> 生成公开网站 JSON
  -> 写入 irissakura.github.io
  -> GitHub Pages 更新
```

## 2. 决策

采用“框架仓库生成公开数据，网站仓库只负责展示”的方式。

- 框架真理源中维护生成脚本和发布工作流。
- GitHub 框架镜像不保留任何 mirror-only 文件或提交。
- 网站仓库接收 `data/framework.json`，页面通过 JavaScript 读取并渲染。
- 当前静态页面内容保留为加载失败时的回退。
- 跨仓库写入使用网站仓库专属、允许写入的 SSH Deploy Key。

## 3. 公开数据边界

输入文件：

```text
docs/reference/framework-inventory.generated.json
```

输出文件：

```text
irissakura.github.io/data/framework.json
```

输出仅允许包含白名单字段：

- schemaVersion
- sourceCommit
- generatedAt
- packageCount
- catalogModuleCount
- presetCount
- profileCount
- asmdefCount
- lifecycleCounts
- layers 的 id、description、packageCount
- 明确允许公开的 featuredModules

禁止导出：

- 源码和完整文档目录
- 内部路径、服务器地址和 CI 配置值
- Secret、Token、账号信息
- 未公开计划、审计、路线图与内部治理备注
- 任意未经过白名单处理的原始对象

## 4. 框架仓库组件

### 4.1 公开数据生成器

路径：

```text
tools/site/generate-public-site-data.mjs
```

职责：

1. 读取权威 inventory JSON。
2. 校验必要字段和 schemaVersion。
3. 使用显式字段白名单生成网站 JSON。
4. 接收来源提交 SHA。
5. 稳定排序数组，保证相同输入产生相同输出。
6. 输入不合法时返回非零退出码，不生成残缺结果。

### 4.2 GitHub Actions 工作流

路径：

```text
.github/workflows/publish-framework-site.yml
```

触发条件：

- `main` 分支推送，且 inventory 或生成器发生变化。
- `workflow_dispatch` 手动执行。

步骤：

1. Checkout 框架镜像。
2. 运行生成器。
3. 使用 `WEBSITE_DEPLOY_KEY` Checkout 网站仓库。
4. 替换 `data/framework.json`。
5. 仅在文件确实变化时提交。
6. 推送到网站仓库 `main`。

工作流使用 `concurrency` 防止并发发布互相覆盖，并只授予框架仓库 `contents: read`。

## 5. 网站仓库组件

### 5.1 数据文件

```text
data/framework.json
```

仓库中保存一份合法初始数据，使网站在自动化启用前即可完成页面开发和验证。

### 5.2 页面渲染

修改：

```text
pages/framework.html
dist/framework.js
```

页面为动态字段提供稳定 DOM 标识，至少展示：

- 包数量
- 模块数量
- Profile 数量
- 架构分层与各层包数量
- 生命周期分布
- 来源提交短 SHA
- 数据更新时间

加载行为：

1. 请求 `../data/framework.json`。
2. 校验顶层结构及关键数字字段。
3. 成功后覆盖静态默认内容。
4. 网络错误、JSON 错误或字段错误时保留静态页面。
5. 在控制台输出结构化错误，不向用户展示技术异常堆栈。

## 6. 凭据与权限

使用网站仓库专属 SSH Deploy Key：

- 公钥添加到 `irissakura.github.io` 的 Deploy keys，并启用写权限。
- 私钥保存为 `UnityGameFramework` Actions Secret：`WEBSITE_DEPLOY_KEY`。
- 该密钥不得复用于其他仓库或服务器登录。

## 7. 真理源规则

框架侧文件必须首先提交到 Gitea 权威仓库：

```text
tools/site/generate-public-site-data.mjs
.github/workflows/publish-framework-site.yml
```

不得只在 GitHub 镜像中创建，因为下一次镜像可能覆盖这些提交。网站仓库不是 Gitea 镜像，可以直接通过 GitHub PR 修改。

## 8. 失败隔离

- 生成失败：工作流停止，不修改网站仓库。
- 网站仓库 Checkout 或 Push 失败：已有网站内容保持不变。
- JSON 加载失败：页面显示静态回退内容。
- 连续镜像提交：concurrency 取消旧发布，仅保留最新一次。
- 数据无变化：不创建空提交。

## 9. 验证标准

### 生成器

- 能从当前 inventory 生成合法 JSON。
- 缺少 summary、layers 或 schemaVersion 时失败。
- 输出不包含白名单外字段。
- 相同输入及 SHA 产生稳定结果。

### 网站

- 本地静态服务器下能加载数据并更新数字。
- 删除或破坏 JSON 后页面仍显示静态内容。
- 移动端导航行为不回归。
- GitHub Pages 子路径计算正确。

### 自动化

- 手动工作流能够更新网站数据。
- 数据未变时不产生提交。
- Deploy Key 失效时工作流明确失败且不影响现有页面。

## 10. 非目标

本期不包含：

- 发布完整 DocFX 文档站。
- 将框架源码复制到公开网站。
- 展示完整 131 个模块的交互式目录。
- 改造整个网站构建系统。
- 使用 GitHub App 替换 Deploy Key。
- 从网站仓库反向触发或修改框架仓库。

## 11. 实施拆分

### 网站仓库 PR

- 新增初始 `data/framework.json`。
- 调整 `pages/framework.html`。
- 调整 `dist/framework.js`。
- 保留静态回退并验证路径。

### Gitea 框架仓库提交

- 新增公开数据生成器。
- 新增 GitHub 发布工作流。
- 配置 Deploy Key 后手动验证一次。

两个部分通过 `framework.json` schema 解耦，网站 PR 可以先合并，框架自动发布随后启用。