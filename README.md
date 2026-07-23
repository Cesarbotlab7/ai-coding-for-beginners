# WorkBuddy 保姆级入门教程

一个面向完全零基础用户的中文交互教程：从下载安装到第一个可验收文件任务，再到 Skill、手机助理和自动化。

## 课程结构

- 5 个阶段
- 11 个课程单元
- 每个单元一个核心交互实验
- 学习进度仅保存在浏览器本地
- 所有练习使用虚构数据，不真实修改用户文件

课程事实优先依据 WorkBuddy 官方文档和当前客户端核验；程序员小灰的两篇 X 长文用于教学顺序、案例和踩坑参考。每章 frontmatter 记录核验版本、日期和来源。

## 技术栈

- Astro 5
- MDX 4
- 原生 JavaScript 交互
- Vitest 单元测试
- Playwright 端到端测试
- 腾讯云轻量服务器 + Nginx 静态托管

不引入 React、Vue 或 jQuery。

## 本地开发

```bash
npm install
npm run dev
```

本地地址：`http://localhost:4321`

本机使用 `curl` 访问开发服务器时，需要加 `--noproxy localhost`。

## 验证

```bash
npm run test:unit
npm run build
npm run test:e2e
npm run test:all
```

## 项目结构

```text
content/chapters/          11 个课程 MDX
src/components/workbuddy/  课程交互实验
src/lib/curriculum.ts      阶段和顺序 SSOT
src/lib/workbuddy-labs.ts  可测试的交互判断逻辑
src/pages/                 首页和章节路由
tests/unit/                课程与逻辑单测
tests/e2e/                 浏览器主路径
```

产品、设计和执行状态分别见：

- `SPEC.md`
- `DESIGN.md`
- `PLAN.md`

## 部署

部署仍沿用现有腾讯云/Nginx 链路：

```bash
npm run deploy
```

该命令会触发 push 和远程构建，必须在获得明确确认后执行。

## 许可

内容版权所有，代码采用 MIT 协议。
