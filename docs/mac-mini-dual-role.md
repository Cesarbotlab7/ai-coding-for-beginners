# Mac mini 的双重角色：OpenClaw + 本项目共存

你的 Mac mini 同时承担两个角色：

1. **本地 AI 服务器**：跑 OpenClaw，通过 Feishu 和你交互，7×24 小时后台运行
2. **本项目开发机**：写 Astro 代码、跑 `npm run dev`、部署到腾讯云

这两件事本身不冲突，但几个细节需要注意，避免它们互相干扰。

---

## 环境变量：项目本地化

**不要**把本项目的环境变量写到全局 shell 配置里（`~/.zshrc` / `~/.bash_profile`）。

**原因**：全局 export 会污染所有终端会话，包括 OpenClaw 可能读取的环境。未来加评论系统、分析工具的 API key 时尤其危险。

**做法**：所有项目相关的变量进入 `.env.local`（已在 `.gitignore` 排除），不进入全局。

---

## 端口管理

OpenClaw 可能占用某些端口（和 Feishu 回调相关，或 Kimi API 的代理端口）。Astro 默认占用 **4321**，理论上不冲突，但验证一下有益无害：

```bash
lsof -i:4321
# 如果有输出，说明被占用了
```

如果冲突，修改 `astro.config.mjs`：

```js
export default defineConfig({
  server: { port: 4322 },  // 或其他没被占的端口
});
```

---

## Node 版本管理

你可能 OpenClaw 用 Node 某个版本（或用 Python，那就无所谓），本项目需要 Node 20+。

**推荐做法**：用 nvm 管理版本，项目根目录放一个 `.nvmrc`：

```bash
cd ~/Projects/ai-coding-for-beginners
echo "20" > .nvmrc
```

这样每次 `cd` 进项目目录，nvm 会自动切到 Node 20（需在 `~/.zshrc` 里加 `autoload -U add-zsh-hook` 和 `nvm_auto_use` 钩子，或用 `nvm use` 手动切）。

---

## 磁盘空间

`node_modules` 一个项目就可能几百 MB。你的 Mac mini 同时跑着 OpenClaw，建议：

- 定期 `df -h` 看剩余空间
- 不再迭代的老项目，删掉 `node_modules`（需要时 `npm ci` 重建）
- Astro 的 `.astro/` 和 `dist/` 也可以定期清

---

## 开发流程隔离建议

**物理上**：

- OpenClaw 的代码和配置在 OpenClaw 原有的目录
- 本项目在 `~/Projects/ai-coding-for-beginners`
- 两者不要互相 import 对方的文件

**操作上**：

- 每次动 OpenClaw 前，先看看它在不在跑：`ps aux | grep -i openclaw`（或对应的 Python 进程）
- 本项目的开发和部署，不需要停 OpenClaw

---

## 如果某天真的冲突了

出现"奇怪的环境问题"（比如某条命令昨天好用今天不好用），排查顺序：

1. 是不是 PATH 顺序被改了？`echo $PATH`
2. 是不是装了新的 Homebrew 包覆盖了旧的？`brew list | sort`
3. 是不是 Node 版本被 OpenClaw 的脚本切走了？`which node && node --version`
4. 最坏情况：新开一个干净终端，`cd` 到项目目录从头再试

---

## 对 Claude Code 的硬性约束

如果你让 Claude Code 帮你跑命令，第一次会话时贴这段给它：

```
这台 Mac mini 同时运行着 OpenClaw（我的本地 AI 服务器，持续运行中）。
你在执行任何命令时必须遵守：
1. 禁止 kill 任何你不认识的进程
2. 禁止修改 ~/.zshrc 或 ~/.bash_profile 里已存在的配置行
3. 添加环境变量到 .env.local，不要 export 到全局
4. 开服务前先 `lsof -i:<port>` 检查冲突
5. 如果需要系统级安装（brew/npm -g），先用 plan mode 告诉我一声
```
