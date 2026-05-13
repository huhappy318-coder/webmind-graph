# WebMind Graph

WebMind Graph 是一个轻量级网页文章知识图谱 Demo。用户可以输入多个 URL，或直接粘贴文章文本，系统会抓取/读取内容，使用 mock 或已配置的 AI Provider 生成概念、关键词、实体和关系，并在前端渲染为可交互的知识图谱。

当前主部署方案是 **Cloudflare Pages + Pages Functions**。项目不需要手动维护 Python 服务，也不依赖 Docker 在线运行。

## 核心功能

- 输入多个文章 URL，每行一个
- 支持手动粘贴正文文本
- 默认 mock 模式可直接运行，不需要 API Key
- 配置 `DEEPSEEK_API_KEY` 后自动启用 DeepSeek
- 返回稳定的 graph JSON：`nodes`、`links`、`metadata`
- 前端使用 D3 渲染力导向知识图谱
- 支持中文、英文、中英双语界面
- 支持本地保存输入和上次分析结果
- 支持复制摘要、导出 JSON、清空本地数据
- 支持同源 API：
  - `GET /api/available-models`
  - `GET /api/active-model`
  - `POST /api/crawl`
  - `POST /api/analyze`

## 技术栈

- 前端：原生 HTML / CSS / JavaScript
- 图谱：D3.js
- 云端 API：Cloudflare Pages Functions
- 可选 Worker 入口：Cloudflare Workers
- 构建：Node.js 脚本复制静态资源到 `dist`

## 项目结构

```text
webmind-graph/
  frontend/              # 前端静态页面和脚本
  functions/api/         # Cloudflare Pages Functions API 路由
  scripts/               # 构建脚本
  src/                   # 共享业务逻辑和 Worker 入口
  tests/                 # Node 测试
  package.json
  wrangler.toml          # 可选 Worker 部署配置
  .dev.vars.example      # 本地/Cloudflare 环境变量示例
```

## 本地运行

安装依赖：

```bash
npm install
```

构建静态文件：

```bash
npm run build
```

本地预览 Pages + Functions：

```bash
npm run dev
```

`npm run dev` 会先生成 `dist`，再通过 Wrangler 启动 Cloudflare Pages 本地预览。首次运行时，`npx` 可能会下载 Wrangler。

## 测试

```bash
npm test
```

当前测试覆盖模型列表、active model、手动文本分析、URL 分析、空输入拒绝、DeepSeek 环境变量开关和 Worker 静态资源回退。

## 部署到 Cloudflare Pages

在 Cloudflare 面板中选择 **Workers & Pages → Pages → Connect to Git**，连接这个 GitHub 仓库。

推荐配置：

```text
Framework preset: None
Root directory: .
Build command: npm run build
Build output directory: dist
Node.js version: 20
Functions directory: functions
```

环境变量可以先全部留空，项目会使用 mock 模式正常运行。

可选变量：

```text
ACTIVE_MODEL=mock
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_MODEL=deepseek-chat
```

说明：

- 不配置任何 Key：只启用 mock 模型，适合公开演示。
- 配置 `DEEPSEEK_API_KEY`：前端模型下拉框会启用 DeepSeek。
- 如果希望默认使用 DeepSeek，可设置 `ACTIVE_MODEL=deepseek`。
- 不要把真实 API Key 写进前端代码或 README，应放在 Cloudflare 的环境变量/Secret 中。

## 可选 Worker 部署

项目仍保留 `src/worker.js` 和 `wrangler.toml`，用于 Workers + Static Assets 方案：

```bash
npm run worker:dev
npm run worker:deploy
```

但当前推荐线上主方案是 Cloudflare Pages。

## 当前限制

- mock 模型是规则抽取，不等同于真实大模型语义理解。
- URL 抓取依赖 Cloudflare `fetch`，对登录页、强反爬页面、纯 JavaScript 渲染页面可能只能返回降级结果。
- D3 通过 CDN 加载；如果访问环境阻断 CDN，图谱区域会显示加载失败提示。
- 当前只完整接入了 mock 和 DeepSeek；OpenAI、Claude、Gemini、Qwen、Kimi 仍是环境变量驱动的未启用状态。

## 后续优化方向

- 接入更多真实 AI Provider
- 增加图谱 PNG/SVG 导出
- 增加文章对比视图和节点筛选
- 增加更完整的端到端测试
- 将 D3 资源本地化，减少 CDN 依赖
