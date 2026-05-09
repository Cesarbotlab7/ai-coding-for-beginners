# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

---

## 项目是什么

面向**完全零基础小白**的 AI 编程入门教程网站。贯穿案例是作者的真实项目"AI热点资讯平台"。

**核心设计原则**，修改代码或内容时必须遵守：

1. **用比喻替代术语**。"前端=餐厅门面、后端=后厨、数据库=仓库、服务器=店铺地址、域名=招牌"——这套比喻贯穿始终。
2. **真实项目优先于虚构案例**。不要编造 todo app。
3. **每章必须有可玩的交互**。交互是这个教程形式的核心价值。
4. **节奏"先全景 → 再拆解 → 最后动手"**。
5. **破除神秘感**。每章的元信息：你能看懂，你能做到。

---

## 常用命令

```bash
npm run dev        # 本地开发服务器 http://localhost:4321
npm run build      # 生产构建，产物在 dist/
npm run preview    # 本地预览生产构建
npm run deploy     # 触发远程部署脚本 scripts/deploy-remote.sh
```

> **注意**：本机 curl 请求本地服务器需加 `--noproxy localhost`，否则会走代理失败。

---

## 技术架构

### 框架与依赖

- **Astro 5** + **`@astrojs/mdx@4`**（注意：mdx@5 需要 Astro 6，不要升级）
- 纯静态输出，无服务端运行时
- 项目路径：`~/Projects/ai-coding-for-beginners-mac/`（Mac mini 上是 `~/Desktop/Projects/...`）

### 内容系统

章节文件是 `.mdx`（非 `.md`），放在 `content/chapters/`（项目根目录，不在 `src/` 下）。

Astro Content Collections 通过 **glob loader** 读取：

```ts
// src/content/config.ts
loader: glob({ pattern: '**/*.{md,mdx}', base: './content/chapters' })
```

章节 frontmatter 必填字段：`slug`、`title`、`stage`（0/1/2/3）、`order`、`summary`、`updated`。

slug 不必须跟文件名一致，也不必须是 `chapter-N` 格式（如 `install-Codex`）。`chapterCloserMap` 和路由都以 slug 为 key。

### 组件注入到 MDX 的方式

章节 MDX 里直接写 `<ComponentName />` 标签。`src/pages/chapter/[slug].astro` 负责把组件作为 `components` prop 传给 `<Content>`：

```astro
<Content components={{ ImaginationVsReality, FileExplorer, ChapterCloser }} />
```

**添加新章节组件时**，必须在 `[slug].astro` 的 import 列表和 `components` 对象里都加上，否则 MDX 里的标签会被忽略。

### ChapterCloser 的数据传入方式

`ChapterCloser.astro` 是通用组件，需要通过 props 传入 `takeaways`、`quote`、`next`。由于 MDX 里 `<ChapterCloser />` 不带 props，每章创建一个专用包装器：

```
src/components/chapters/
└── Chapter0Closer.astro   ← 内嵌第0章数据，透传给 ChapterCloser
```

在 `[slug].astro` 里通过 `chapterCloserMap` 按 slug 选择对应包装器。添加新章节时，在此 map 里注册。

### 首页结构

`src/pages/index.astro` 的布局顺序：**hero → `<AIIntroSection />` → 章节列表（按 stage/order 排序）→ footer**。

`AIIntroSection` 是面向零基础用户的 AI 破冰区（翻转卡片 + 能/不能对比 + 模拟对话），放在 `src/components/AIIntroSection.astro`，不接受 props。

### 设计系统

所有颜色、间距、字体、圆角通过 CSS 变量使用，定义在 `src/styles/tokens.css`，在 `BaseLayout.astro` 的 frontmatter 里 import：

```ts
import '../styles/tokens.css';
import '../styles/global.css';
```

**禁止**在任何组件里硬编码颜色/px 值。

### 组件数据文件

交互组件的大型数据（如 FileExplorer 的节点树）单独放在 `content/data/`，在组件 frontmatter 里 import，再序列化为 `data-*` attribute 给客户端 JS 读取：

```astro
---
import { TREE } from '../../content/data/file-explorer-nodes.ts';
---
<div data-tree={JSON.stringify(TREE)}>
```

---

## 添加新章节的完整流程

1. 创建 `content/chapters/chapter-N.mdx`（复制 frontmatter 模板，改 slug/title/stage/order）
2. 在 MDX 正文用 `<ComponentName />` 插入组件
3. 如果需要新组件，在 `src/components/` 创建，并在 `src/pages/chapter/[slug].astro` 注册
4. 如果有 ChapterCloser，在 `src/components/chapters/ChapterNCloser.astro` 创建包装器，并在 `[slug].astro` 的 `chapterCloserMap` 里添加条目
5. `npm run build` 验证无报错

---

## 内容写作规则

**写作语气**：
- 第二人称"你"，不用"同学们"、"各位"
- 不说"其实很简单"、"一看就懂"
- 金融和哲学类比可以用，不要炫学识

**每章结构**（强烈建议）：
1. 开场：让小白放下戒备的切入
2. 主体：核心交互组件 + 配套文字
3. 收尾：ChapterCloser（你学到了N件事）
4. 桥接：下一章预告（等对应章节上线后再开放链接）

---

## 内容与方案变更闸门

涉及章节内容、教程表达、产品定位、对外可见文案、外部材料吸收、课程结构调整时，默认先只做三件事：

1. 复述材料要点和判断，不直接写入文件。
2. 给出建议放置位置、内容大纲、关键文案草稿。
3. 等 Cesar 明确确认后，才允许修改 MDX、组件或首页内容。

截图、短视频、文章、外部建议只能先转成“可审阅草稿”，不得直接当最终内容落地。

---

## 组件开发规则

- **不引入 React**。简单交互用纯 Astro + 原生 JS；复杂状态可选 Svelte。
- Astro 组件分三段：frontmatter（`---`之间）→ HTML 模板 → `<style>` + `<script>`。
- `<script>` 里的 JS 是客户端代码，不能直接用 frontmatter 里的变量（需通过 `data-*` attribute 传递）。
- frontmatter 里只能用 `//` 注释，**不能用** `<!-- -->`（会报 parse error）。
- 字符串内含有 `"` 中文引号时，外层用单引号 `'` 包裹，避免 esbuild 误解析。
- **JS 动态创建的元素拿不到 Astro scoped 样式**。凡是通过 `document.createElement` 创建后再 `appendChild` 的元素，其 CSS 类必须放在 `<style is:global>` 里，否则样式完全不生效。

**可访问性硬性要求**：
- 所有交互元素键盘可达
- 图标配 `aria-label` 或 `aria-hidden="true"` + 文字说明
- 色彩对比度 WCAG AA

---

## 部署

**开发端**（Mac mini，`~/Desktop/Projects/ai-coding-for-beginners-mac/`）：

- 机器同时运行 OpenClaw（本地 AI 服务）。涉及端口、后台服务时不要破坏它。
- `npm run deploy` 要求本机 SSH key 已加入服务器 `authorized_keys`。不同机器首次部署前需先配置 SSH key。详见 `docs/first-time-setup.md`。

**GitHub 仓库**：https://github.com/Cesarbotlab7/ai-coding-for-beginners

**生产端**（腾讯云轻量服务器，Ubuntu 22.04）：

- 服务器 IP：`124.222.23.162`，SSH 用户：`ubuntu`
- 教程站运行在 **8080 端口**（80 端口被 AI 资讯平台占用）
- 项目路径：`/var/www/ai-coding-for-beginners`
- Nginx 直接服务 `dist/` 目录，无需 reload
- **日常部署**：`npm run deploy`（本地 commit 后运行，自动 push + 远程构建）

---

## 工作守则

**改代码前**：
1. 读 `SPEC.md` 找对应规格
2. 查 `DESIGN.md` 确认 token 用法
3. 看 `PLAN.md` 确认当前阶段（某些功能故意推后）

**不要做的事**：
- 不硬编码颜色、间距
- 不引入 React/Vue/jQuery
- 不删除 `docs/decisions.md` 里的历史决策
- 不把业务逻辑写进 Astro 组件——拆到单独 TS 文件

**发现冲突时**：先问，不要默默执行。规格文档有矛盾时，主动指出。

## 执行权限边界

- 修 bug、测试失败、明确指定的小代码任务：可在说明范围后执行到底。
- 内容类 / 方案类 / 规则类 / 产品方向类任务：确认前不得改文件。
- 修改超过 3 个文件：先输出计划和文件清单，确认后执行。
- commit 前说明将提交哪些文件；内容类任务必须在 Cesar 确认内容后才 commit。
- push、PR、merge、deploy 必须获得 Cesar 明确确认。
