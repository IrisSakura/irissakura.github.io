# Gitea 真理源补丁说明

此目录中的文件仅用于交付，不应长期保留在个人网站仓库的最终主分支。

请将文件复制到云服务器上的 `UnityGameFramework` Gitea 权威仓库：

```text
gitea-patch/tools/site/generate-public-site-data.mjs
  -> tools/site/generate-public-site-data.mjs

gitea-patch/.github/workflows/publish-framework-site.yml
  -> .github/workflows/publish-framework-site.yml
```

然后在 Gitea 权威仓库提交并推送，使这些文件随镜像同步到 GitHub。

## Deploy Key

1. 在本地生成一对专用 Ed25519 密钥。
2. 将公钥添加到 `IrisSakura/irissakura.github.io` 的 `Settings -> Deploy keys`，并启用写权限。
3. 将私钥添加到 `IrisSakura/UnityGameFramework` 的 `Settings -> Secrets and variables -> Actions`。
4. Secret 名称必须为：

```text
WEBSITE_DEPLOY_KEY
```

该密钥只用于从框架镜像写入个人网站仓库，不得复用于服务器登录或其他仓库。

## 手动验证

完成密钥配置并等待 Gitea 镜像同步后，在 GitHub 的 `UnityGameFramework` 仓库中手动运行：

```text
Actions -> Publish Framework Data To Website -> Run workflow
```

成功后，网站仓库的 `data/framework.json` 应产生一条 `chore(framework): sync <sha>` 提交。若生成数据无变化，工作流会正常结束且不产生空提交。
