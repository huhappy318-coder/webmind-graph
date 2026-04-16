# WebMind Graph

WebMind Graph 目前已经整理成适合直接上传 GitHub，并由 Cloudflare 直接导入托管的版本。

当前主部署路线是：

- Cloudflare Workers
- Cloudflare Static Assets
- 前端和 API 同源部署
- 默认使用 `mock` 模式
- 已支持通过环境变量启用 `DeepSeek`
- 不依赖真实 AI API key

## 当前版本能做什么

这个版本已经支持：

- 访问 `/` 直接打开前端页面
- 输入一个或多个文章 URL
- 粘贴手动文本内容
- 使用 mock 模式进行分析
- 通过 `/api/analyze` 返回图谱 JSON
- 在浏览器中渲染 D3 知识图谱
- 通过 `/api/crawl` 测试抓取单个 URL
- 通过 `/api/available-models` 和 `/api/active-model` 获取模型信息

## 当前适合的部署方式

这个仓库现在是 **Cloudflare 优先** 的结构，不再以 Docker 或 Python 常驻服务作为线上主入口。

```text
webmind-graph/
  src/
    worker.js
    webmind.js
  frontend/
    index.html
    graph.js
    panel.js
    websocket.js
    style.css
  tests/
    worker.test.mjs
  wrangler.toml
  package.json
  .dev.vars.example
```

## 核心文件说明

- `src/worker.js`
  Cloudflare Worker 入口文件，负责处理 `/api/*` 请求，以及回退到静态资源。

- `src/webmind.js`
  核心业务逻辑，包括：
  - URL 抓取
  - mock 抽取
  - DeepSeek 抽取
  - 图谱生成
  - 图谱融合
  - analyze 响应结构生成

- `frontend/`
  前端静态资源目录，会由 Cloudflare 直接托管。

- `wrangler.toml`
  Cloudflare Workers 配置文件，包含 Worker 入口、兼容日期、静态资源目录等信息。

## 本地预览方法

### 1. 安装依赖

```bash
npm install
```

### 2. 可选：复制本地变量文件

Windows:

```bash
copy .dev.vars.example .dev.vars
```

macOS / Linux:

```bash
cp .dev.vars.example .dev.vars
```

### 3. 本地启动 Cloudflare Worker 预览

```bash
npm run dev
```

### 4. 打开本地地址

Wrangler 一般会输出一个本地地址，通常是：

[http://localhost:8787](http://localhost:8787)

## 部署到 Cloudflare

这个仓库的目标就是：

> 上传 GitHub
> 在 Cloudflare 中导入仓库
> 直接部署

### Cloudflare 面板里要注意的两件事

1. 选择 **Workers**，不要选 **Pages**
   - 当前仓库是 `wrangler.toml + src/worker.js + frontend/` 的 Worker 结构
   - 如果部署成 Pages，通常会出现 `pages.dev` 根路径 404，或者前端能出但 API 结构不对

2. Root directory 要指向仓库根目录
   - 当前应填写 `.`
   - 不需要额外的 build output 目录
   - 静态资源目录已经在 `wrangler.toml` 里声明为 `frontend/`

### 仓库中已经包含的部署文件

- `wrangler.toml`
- `package.json`
- `src/worker.js`
- `frontend/`

### 当前可选环境变量

目前推荐这几个变量：

- `ACTIVE_MODEL=mock`
- `DEEPSEEK_API_KEY=你的 DeepSeek Key`
- `DEEPSEEK_MODEL=deepseek-chat`

说明：

- 不配置任何 secret 时，系统会继续使用 `mock`
- 配置 `DEEPSEEK_API_KEY` 后，前端下拉框会自动启用 `DeepSeek`
- 如果你还希望默认直接使用 DeepSeek，可以把 `ACTIVE_MODEL` 设为 `deepseek`
- 其他模型当前仍会读取配置状态，但托管版 demo 只真正接通了 `mock` 和 `DeepSeek`

## API 列表

当前版本保留这些接口能力：

- `GET /`
- `GET /api/health`
- `GET /api/available-models`
- `GET /api/active-model`
- `POST /api/crawl`
- `POST /api/analyze`

## 本地测试

当前推荐运行 Worker 侧测试：

```bash
npm test
```

## 当前限制

- URL 抓取是轻量规则方案，对强反爬、纯 JavaScript 页面、登录墙页面不一定稳定
- mock 抽取是规则法，不是真正的大模型语义理解
- D3 仍然通过 CDN 加载
- 仓库里还保留了旧的 Python / FastAPI / Docker 文件，主要用于历史兼容或本地参考，但已经不是云端主部署路径
- 为了避免 Cloudflare 自动把仓库识别成 Python 主项目，根目录已经不再保留 `requirements.txt`

## 关于旧文件

仓库中仍然保留一些旧的本地开发遗留文件，例如：

- `backend/`
- `Dockerfile`
- `docker-compose.yml`
- `requirements.legacy.txt`
- `test_*.py`

这些文件现在不再是 Cloudflare 托管主方案的一部分。

如果你的目标是：

> GitHub 上传
> Cloudflare 直接导入
> 在线演示

那么应该以以下内容为准：

- `src/worker.js`
- `src/webmind.js`
- `frontend/`
- `wrangler.toml`
- `package.json`
