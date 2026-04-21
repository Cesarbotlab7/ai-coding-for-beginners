# PLAN.md — 开发阶段计划

本文档定义项目的分阶段执行计划。每一个 Phase 都有明确的完成标准（Definition of Done），只有上一个 Phase 完成后才进入下一个。

---

## 项目总体目标

建成一个**中文 AI 编程入门教程网站**，面向完全零基础小白，通过 11 章内容（含引子）+ 可交互组件，让读者建立"我能用 AI 做产品"的信心。

---

## Phase 1：骨架与第 0 章 MVP

**目标**：跑通"本地开发 → GitHub → 服务器 → 公网访问"的完整链路，并发布第 0 章。

### 任务清单

1. **初始化 Astro 项目**
   - 在 `~/Projects/ai-coding-for-beginners` 执行 `npm create astro@latest`
   - 选择最简模板（Empty），TypeScript 严格模式
   - 配置 `astro.config.mjs`：输出为 `dist/`，site 字段暂空（未接域名）

2. **搭建基础结构**
   - 创建 `src/layouts/BaseLayout.astro`（全局壳：html、head、全局 CSS 变量注入）
   - 创建 `src/layouts/ChapterLayout.astro`（章节页布局：顶部导航 + 正文区 + 底部上下章）
   - 创建 `src/pages/index.astro`（首页：目录）
   - 创建 `src/pages/chapter/[slug].astro`（动态路由）

3. **注入设计系统**
   - 创建 `src/styles/tokens.css`（DESIGN.md 里定义的所有 CSS 变量）
   - 创建 `src/styles/global.css`（基础重置 + typography）
   - 在 `BaseLayout` 中引入

4. **第 0 章内容迁移**
   - 创建 `content/chapters/chapter-0.md`（见本仓库 `content/chapters/chapter-0.md` 已预置）
   - 创建 `content/data/file-explorer-nodes.ts`（FileExplorer 组件的数据源）
   - 实现三个组件：
     - `src/components/ImaginationVsReality.astro`
     - `src/components/FileExplorer.astro`
     - `src/components/ChapterCloser.astro`

5. **配置 Content Collections**（Astro 的内容管理能力）
   - 创建 `src/content/config.ts`，定义 chapters collection 的 schema（slug、title、stage、order 等）
   - 在章节页通过 `getCollection('chapters')` 读取

6. **GitHub 仓库建立**
   - 在 GitHub 新建私有仓库 `ai-coding-for-beginners`
   - `git init`、`git remote add origin`、首次推送
   - 确认 `.gitignore` 排除 `node_modules`、`dist`、`.env.local`

7. **腾讯云轻量服务器初始化**
   - SSH 登录服务器（开发者电脑提供 IP 和密钥路径）
   - 安装 nvm + Node.js（版本匹配 `package.json` 的 `engines`）
   - 安装 Nginx
   - 创建部署目录 `/var/www/ai-coding-for-beginners`
   - 配置 Nginx 站点：root 指向 `/var/www/ai-coding-for-beginners/dist`，监听 80 端口
   - 开放防火墙 80 端口

8. **首次部署**
   - 服务器 clone 仓库
   - `npm ci && npm run build`
   - 访问 `http://[公网IP]` 验证首页可见、第 0 章可打开

### 完成标准（Phase 1 DoD）

- [ ] 本地 `npm run dev` 可启动
- [ ] 本地 `npm run build` 无报错
- [ ] GitHub 私有仓库建立，main 分支可推送
- [ ] 腾讯云服务器能通过公网 IP 访问首页
- [ ] 第 0 章页面完整：开场 + FileExplorer + 收尾都可交互
- [ ] 深色模式自动切换正常
- [ ] 移动端（360px 宽度）无横向滚动

---

## Phase 2：自动化部署 + 第 1 章

**目标**：简化部署流程，并完成第 1 章内容。

### 任务清单

1. **GitHub Actions 自动构建**
   - 在 `.github/workflows/build.yml` 配置 push 后触发 build 测试（确保新提交不会破坏构建）
   - 初期不做自动推送到服务器（需要配 SSH key secret，Phase 3 再做）

2. **服务器部署脚本**
   - 创建 `scripts/deploy.sh`：`cd /var/www/... && git pull && npm ci && npm run build`
   - 本地创建对应的 `scripts/deploy-remote.sh`：通过 SSH 触发服务器脚本
   - 测试：本地一条命令完成部署

3. **第 1 章内容与组件**
   - 补充 `SPEC.md` 中的第 1 章详细规格
   - 创建 `content/chapters/chapter-1.md`
   - 实现交互组件（按钮点击演示数据流动）

### 完成标准（Phase 2 DoD）

- [ ] 一条命令（`npm run deploy` 或 `./scripts/deploy.sh`）完成部署
- [ ] GitHub Actions build 检查通过
- [ ] 第 1 章上线可访问

---

## Phase 3：第 2–4 章 + 自动部署

**目标**：完成阶段一的全部内容（地图篇），并实现 push 即部署。

### 任务清单

1. **push 自动部署**
   - GitHub Actions 加入 deploy job
   - 配置 SSH key 为 repository secret
   - push 到 main 后自动 SSH 到服务器执行部署脚本

2. **第 2、3、4 章**
   - 第 2 章：把互联网产品想象成一家餐厅（核心比喻章）
   - 第 3 章：前端和后端
   - 第 4 章：GitHub

3. **首页优化**
   - 章节卡片增加"新"标记
   - 阶段切换 Tab

### 完成标准（Phase 3 DoD）

- [ ] main 分支 push 后 2 分钟内网站自动更新
- [ ] 阶段一（第 1-3 章）+ 第 4 章完整上线

---

## Phase 4：第 5–7 章

**目标**：完成阶段二（玩家篇）。

内容：数据库、服务器、域名 DNS HTTPS。

---

## Phase 5：第 8–10 章

**目标**：完成阶段三（动手篇）。

内容：Claude Code 使用、30 分钟小工具、上线后的迭代。

**特别注意**：第 9 章的"30 分钟小工具"是简化版 AI 资讯平台——静态 JSON 数据 + 硬编码的假 AI 摘要，不接 Supabase、不接 DashScope、不写 scraper。只让读者用 Astro + Vercel 跑通"写代码 → 上线"的最小闭环。

---

## Phase 6：接域名 + HTTPS + 分析

**目标**：ICP 备案完成后，接上自己的域名，加 HTTPS，加站点分析。

### 任务清单

- 域名 DNS 解析到服务器 IP
- Nginx 配置域名 server_name
- Certbot 签发 Let's Encrypt 证书
- 强制 HTTPS 重定向
- 接入 Plausible / Umami 等轻量隐私友好的分析工具

---

## 不在 MVP 范围内的功能（明确 defer）

以下功能在 Phase 6 之前**不做**，即使技术上可行：

- 评论系统
- 用户登录
- 全文搜索
- RSS 订阅
- 多语言（英文版）
- 导出为 PDF
- 暗黑模式手动切换（自动跟随系统即可）
- 代码在线试运行（CodeSandbox 嵌入等）

这些是"做大了再说"的东西。**先完成 > 先完美**。

---

## 风险与预案

| 风险 | 可能影响 | 预案 |
|------|---------|------|
| 腾讯云网络波动 | 部署或访问失败 | 本地保留 `dist/` 备份，必要时用阿里云 / Cloudflare Pages 临时托管 |
| Claude Code API token 超预算 | 开发进度停滞 | 使用 plan mode 降低 token 消耗；遇到复杂任务分批执行 |
| Astro 版本破坏性升级 | 构建失败 | `package.json` 中锁定 major 版本；升级前先本地试 |
| 内容写作疲劳 | 章节质量下降 | 每个阶段完成后休息 1 周；征集读者反馈校准方向 |
