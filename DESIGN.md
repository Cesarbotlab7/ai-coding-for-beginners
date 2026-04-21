# DESIGN.md — 设计系统

本文档定义网站的视觉语言。所有组件和页面必须使用这里定义的设计 tokens，不允许在代码中硬编码颜色、字体、间距。

---

## 设计哲学

1. **安静优于喧闹**。这是一个阅读为主的教程网站，视觉设计的任务是让内容好读，不是抢戏。
2. **留白是内容的一部分**。宁可多留空白，也不堆砌元素。
3. **不炫技**。没有渐变、没有阴影动画、没有粒子效果。扁平、干净、可信。
4. **浅色主题为主，深色模式自动适配**。两种模式都要测试。

---

## 颜色系统

所有颜色都以 CSS 变量形式声明，自动支持浅色/深色模式切换。

### 基础变量

```css
:root {
  /* 背景色 */
  --color-bg: #fafaf7;              /* 页面主背景（近白，略暖）*/
  --color-bg-primary: #ffffff;      /* 卡片、主体内容区 */
  --color-bg-secondary: #f1efe8;    /* 次要区域、代码块背景 */
  --color-bg-tertiary: #e8e6df;     /* 更深一层，分隔区域 */

  /* 文字色 */
  --color-text-primary: #2c2c2a;    /* 正文 */
  --color-text-secondary: #5f5e5a;  /* 次要文字、说明 */
  --color-text-tertiary: #888780;   /* 辅助、时间戳 */

  /* 边框 */
  --color-border: rgba(44, 44, 42, 0.15);
  --color-border-secondary: rgba(44, 44, 42, 0.30);

  /* 语义色 —— 信息 */
  --color-bg-info: #e6f1fb;
  --color-text-info: #0c447c;

  /* 语义色 —— 成功 */
  --color-bg-success: #eaf3de;
  --color-text-success: #27500a;

  /* 语义色 —— 警告 */
  --color-bg-warning: #faeeda;
  --color-text-warning: #633806;

  /* 语义色 —— 危险 */
  --color-bg-danger: #fcebeb;
  --color-text-danger: #791f1f;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a18;
    --color-bg-primary: #242422;
    --color-bg-secondary: #2e2e2b;
    --color-bg-tertiary: #383834;

    --color-text-primary: #e8e6df;
    --color-text-secondary: #b4b2a9;
    --color-text-tertiary: #888780;

    --color-border: rgba(232, 230, 223, 0.15);
    --color-border-secondary: rgba(232, 230, 223, 0.30);

    --color-bg-info: #042c53;
    --color-text-info: #b5d4f4;
    --color-bg-success: #173404;
    --color-text-success: #c0dd97;
    --color-bg-warning: #412402;
    --color-text-warning: #fac775;
    --color-bg-danger: #501313;
    --color-text-danger: #f7c1c1;
  }
}
```

### 分类调色板（用于图表、节点、卡片类目着色）

当需要给不同类别上色（例如 FileExplorer 里的"角色"标签），从以下 4 种色相中选：

- 紫 Purple：浅 `#eeedfe` / 深 `#3c3489`
- 青 Teal：浅 `#e1f5ee` / 深 `#085041`
- 珊瑚 Coral：浅 `#faece7` / 深 `#712b13`
- 灰 Gray（中性）：浅 `#f1efe8` / 深 `#444441`

**规则**：一个页面最多用 2 种分类色 + 灰色。不要 6 色彩虹。

---

## 字体系统

### 字族

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI",
             "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
             sans-serif;
--font-serif: Georgia, "Songti SC", "SimSun", serif;
--font-mono: "SF Mono", Menlo, Monaco, "Cascadia Code",
             "Source Han Mono SC", "Sarasa Mono SC", monospace;
```

**用法**：

- 正文、标题、UI 元素 → `--font-sans`
- 引语、文学化段落 → `--font-serif`
- 代码、文件路径、命令行 → `--font-mono`

### 字号与行高

| token | size | line-height | 用途 |
|-------|------|-------------|------|
| `--text-xs` | 12px | 1.5 | 时间戳、脚注、小标签 |
| `--text-sm` | 13px | 1.6 | 说明文字、次要内容 |
| `--text-base` | 16px | 1.75 | 正文 |
| `--text-md` | 18px | 1.5 | 小标题 h3 |
| `--text-lg` | 20px | 1.4 | 中标题 h2 |
| `--text-xl` | 24px | 1.3 | 大标题 h1、章节标题 |
| `--text-2xl` | 32px | 1.2 | Hero 区 |

### 字重

**只用两种**：

- `--font-regular: 400` —— 正文、大部分 UI
- `--font-medium: 500` —— 标题、强调、按钮文字

**不使用 600/700**——太粗的字重在现代屏幕上会显得沉重廉价。

---

## 间距系统

所有间距使用 8px 基础单位的倍数。

```css
--space-1: 4px;    /* 紧密元素间 */
--space-2: 8px;    /* 组件内部 */
--space-3: 12px;   /* 组件内部较大 */
--space-4: 16px;   /* 组件间小距 */
--space-5: 24px;   /* 组件间标准距 */
--space-6: 32px;   /* 段落间距 */
--space-7: 48px;   /* 章节间距 */
--space-8: 64px;   /* 大区块间距 */
```

**用法原则**：

- 组件内部 padding：`--space-3` 到 `--space-5`
- 段落间距：`--space-6`
- 章节内大块之间：`--space-7`
- 绝对不要出现 `3px`、`10px`、`15px` 这种非倍数值

---

## 圆角

```css
--radius-sm: 4px;    /* 小元素：徽章、tag、输入框 */
--radius-md: 8px;    /* 常规：卡片、按钮、代码块 */
--radius-lg: 12px;   /* 大块：章节卡片、主要容器 */
--radius-xl: 16px;   /* 装饰性大块：Hero 区 */
```

**禁止**：不规则圆角（例如 `border-radius: 20px 4px 20px 4px`）。

---

## 边框

默认粗细 **0.5px**（使用 `border: 0.5px solid var(--color-border)`）。只有强调时用 1px。

**不使用**：2px 及以上粗边框，除了"推荐项"高亮（见下方卡片规格）。

---

## 阴影

**默认不使用阴影**。仅允许的两种场景：

1. 输入框聚焦环：`box-shadow: 0 0 0 3px var(--color-bg-info)`
2. 无其他情况

---

## 组件规格

### 按钮

**基础样式**：

```css
button {
  padding: var(--space-2) var(--space-4);
  border: 0.5px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background-color 0.12s;
}
button:hover { background: var(--color-bg-secondary); }
button:active { transform: scale(0.98); }
```

**主要按钮**（少量，用于明确的 primary action）：

```css
button.primary {
  background: var(--color-text-primary);
  color: var(--color-bg);
  border-color: transparent;
}
```

### 卡片

```css
.card {
  background: var(--color-bg-primary);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
```

### 徽章 / Tag

```css
.badge {
  display: inline-block;
  padding: 2px var(--space-2);
  border-radius: 10px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--color-bg-info);
  color: var(--color-text-info);
}
```

不同语义使用不同的 `bg + text` 组合。

### 代码块

```css
pre {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
}
code:not(pre > code) {
  background: var(--color-bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
}
```

### 引语（章节收尾用）

```css
blockquote.pull-quote {
  border-left: 2px solid var(--color-border-secondary);
  padding: var(--space-4) var(--space-5);
  font-family: var(--font-serif);
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--color-text-secondary);
  font-style: normal;
}
```

---

## 布局约定

### 内容最大宽度

- 正文区：680px
- 首页 Hero 和大段落：880px
- 移动端：保留 16px 两侧 padding

### 响应式断点

- 移动端：< 640px
- 桌面：≥ 640px（本系列不做细分到 tablet）

---

## 禁止项（视觉红线）

禁止出现的元素或效果：

- 渐变背景（linear-gradient / radial-gradient）
- 阴影装饰（box-shadow 用于"浮起"效果）
- 模糊滤镜（backdrop-filter: blur）
- 霓虹发光（text-shadow 的发光效果）
- 动画边框（animated borders）
- 粒子、马赛克、噪点背景
- emoji 作为 UI 图标（必须用 SVG）
- 全大写英文标题（除非是品牌名）
- 粗体中插（句子中间用 `<strong>` 突出某个词）

---

## 图标

**来源**：统一使用 [Lucide Icons](https://lucide.dev) 的 SVG 版本（无外部依赖，直接内联）。

**规格**：

- 文件图标、文件夹图标：18px × 18px
- UI 图标（按钮内、面包屑）：14px × 14px
- 装饰图标（卡片头部）：16px × 16px

**禁止**：图标字体（Font Awesome 等）、emoji 作为图标。
