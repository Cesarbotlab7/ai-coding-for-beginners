# PLAN.md — WorkBuddy 教程重建计划

目标：保留 Astro、MDX、静态部署和设计 token 地基，完整替换旧 AI 编程课程，交付 5 个阶段、11 个单元的 WorkBuddy 保姆级交互教程。

## 执行边界

- 本轮完成高保真界面重做、测试、本地 commit、push 和生产部署；该范围已由 Cesar 明确确认。
- 不修改用户已有的 `CLAUDE.md` 和 `.env.example`。
- 不修改根目录 `AGENTS.md`。
- 不复制真实 WorkBuddy 账号、任务、项目或文件内容。

## Phase 1：测试与课程地基

- [x] 安装 Vitest 与 Playwright。
- [x] 建立课程结构测试。
- [x] 建立提示词、模式推荐和自动化检查测试。
- [x] 确认测试先红后绿。
- [x] 创建 `src/lib/curriculum.ts`。
- [x] 创建 `src/lib/workbuddy-labs.ts`。

完成标准：`npm run test:unit` 通过。

## Phase 2：最终态规格与内容模型

- [x] 将 `SPEC.md` 改写为 WorkBuddy 唯一规格。
- [x] 将 `DESIGN.md` 改写为 WorkBuddy 唯一设计系统。
- [x] 将 `PLAN.md` 改写为当前执行计划。
- [x] 更新 Content Collections schema。
- [x] 建立章节和课程 SSOT 一致性检查。

完成标准：旧 AI 编程课程不再出现在三份主规格中。

## Phase 3：页面壳与全局能力

- [x] 更新 `BaseLayout.astro` 的品牌、SEO 和跳转链接。
- [x] 更新 `ChapterLayout.astro` 的阶段、版本与导航。
- [x] 重建首页和本地进度。
- [x] 重构通用 `ChapterCloser.astro`，移除专用包装器。
- [x] 完成全局组件样式和 reduced-motion。

完成标准：首页能从课程数据生成 11 个单元，章节导航使用真实 slug。

## Phase 4：11 个交互课程

- [x] 单元 0：建议与交付对比。
- [x] 单元 1：双系统安装向导。
- [x] 单元 2：工作区安全实验。
- [x] 单元 3：模式和权限决策。
- [x] 单元 4：界面热点图。
- [x] 单元 5：完整第一单。
- [x] 单元 6：五要素提示词生成器。
- [x] 单元 7：产物验收实验。
- [x] 单元 8：记忆审阅器。
- [x] 单元 9：Skill / 专家 / 专家团配对。
- [x] 单元 10：手机助理与自动化毕业任务。

完成标准：每个 MDX 恰好有一个核心交互，且包含成功信号和失败分支。

## Phase 5：旧站清理与文档同步

- [x] 删除旧 MDX。
- [x] 删除旧课程组件和旧章节收尾包装器。
- [x] 删除旧课程数据。
- [x] 更新 `README.md`。
- [x] 在 `docs/decisions.md` 追加取代旧课程方向的 ADR。
- [x] 确认用户文件未进入暂存区。

完成标准：代码和可见文案不再引用 Claude Code、AI 编程课程或旧章节。

## Phase 6：验收

- [x] 单元测试通过。
- [x] 内容结构检查通过。
- [x] 生产构建通过。
- [x] E2E 主路径通过。
- [x] 360px 无横向滚动。
- [x] 键盘主路径通过。
- [x] 浅色、深色和 reduced-motion 检查通过。
- [x] 无控制台错误和断链。

完成标准：`npm run test:all` 通过，并形成真实验收记录。

验收记录（2026-07-23）：

- `npm run test:all`：16 个单元/内容结构测试、12 页生产构建、7 条 E2E 全部通过。
- Lighthouse：首页 Performance 100、Accessibility 100、SEO 100。
- Chrome 实机检查：首页、第一单和 360px 首屏布局正常，控制台无错误。

## Phase 7：高保真客户端重做

- [x] 用 Computer Use 只读核对 WorkBuddy v5.2.6 的新建任务、任务页、模式、权限和工作空间入口。
- [x] 先补“来源不公开”和“统一高保真外壳”的失败测试。
- [x] 新建共享 WorkBuddy 外壳，并接入单元 3、4、5、7。
- [x] 把旧 Craft 文案更新为当前客户端的默认模式、Plan、Ask。
- [x] 移除首页和章节页公开来源模块，保留 frontmatter 内部来源元数据。
- [x] 全量单元测试、构建与 E2E 通过。
- [x] 完成桌面、360px、深色和 reduced-motion 视觉验收。
- [ ] commit、push、部署并复测生产网站。

完成标准：四个关键互动共享同一套 WorkBuddy v5.2.6 外壳，公开页面不显示资料来源，生产网站通过桌面和手机验收。

验收记录（2026-07-23）：

- `npm run test:all`：19 个单元/结构测试、12 页生产构建、9 条 E2E 全部通过。
- Chrome 人工检查：桌面工作台、菜单展开、Plan 确认、右侧产物、360px 内部横向滑动正常，控制台无错误。
- Computer Use 人工检查：首页和界面地图在真实 Chrome 窗口显示正常；发现并修复“更多操作菜单默认常驻”问题。

## 提交计划

1. `feat: 建立 WorkBuddy 课程与交互测试地基`
2. `docs: 重写 WorkBuddy 教程最终态规格`
3. `feat: 重建 WorkBuddy 教程页面与交互`
4. `chore: 清理旧课程并完成验收`
