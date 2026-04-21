# ai-coding-for-beginners

一个面向完全零基础小白的中文 AI 编程入门教程。

## 系列定位

如果你有一个想做的产品想法，但：

- 完全不会写代码
- 听说过 AI 能帮人编程，但不知道从哪里开始
- 一看到"前端后端数据库域名服务器"就头大

这个系列就是为你写的。

## 技术栈

- **框架**：Astro
- **托管**：腾讯云轻量应用服务器 + Nginx
- **仓库**：GitHub 私有
- **AI 协作**：Claude Code

## 本地开发

项目位于 `~/Projects/ai-coding-for-beginners`。

```bash
cd ~/Projects/ai-coding-for-beginners

# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 部署

第一阶段手动部署：

```bash
# 本地推送
git push origin main

# SSH 到腾讯云轻量服务器
ssh ubuntu@<公网IP>
cd /var/www/ai-coding-for-beginners
git pull
npm ci
npm run build
# Nginx 直接服务 dist/ 目录，无需 reload
```

## 项目结构

```
ai-coding-for-beginners/
├── CLAUDE.md            AI 工作协议
├── SPEC.md              功能规格
├── DESIGN.md            设计系统
├── PLAN.md              开发阶段计划
├── content/             章节内容（Markdown）
├── src/                 Astro 源码
└── scripts/             运维脚本
```

详见 `CLAUDE.md`。

## 许可

内容版权所有，代码采用 MIT 协议。

## 作者

César — 金融背景，正在学做产品。

主开发机：Mac mini（同时作为本地 AI 服务器运行 OpenClaw）。
