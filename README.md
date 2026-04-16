# WebMind Graph

WebMind Graph is now organized for direct GitHub -> Cloudflare deployment.

The primary hosting path is:

- Cloudflare Workers
- Cloudflare Static Assets
- Same-origin frontend + API
- Default `mock` mode with no real AI key requirement

## What This Version Supports

- Open the frontend directly from `/`
- Input one or more article URLs
- Input manual article text
- Analyze content in mock mode
- Return graph JSON from `/api/analyze`
- Render a D3 knowledge graph in the browser
- Crawl a URL via `/api/crawl`
- Read `/api/available-models` and `/api/active-model`

## Cloudflare-Ready Structure

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

## Main Runtime Files

- `src/worker.js`: Cloudflare Worker entry
- `src/webmind.js`: API logic, crawl logic, mock extraction, graph building
- `frontend/`: static assets served by Cloudflare
- `wrangler.toml`: Worker + asset configuration

## Local Preview

1. Install dependencies:

   ```bash
   npm install
   ```

2. Optional local vars file:

   Windows:

   ```bash
   copy .dev.vars.example .dev.vars
   ```

   macOS/Linux:

   ```bash
   cp .dev.vars.example .dev.vars
   ```

3. Start local preview:

   ```bash
   npm run dev
   ```

4. Open the local Wrangler URL, usually:

   [http://localhost:8787](http://localhost:8787)

## Deploy to Cloudflare

This repository is intended to be imported directly from GitHub into Cloudflare Workers.

### Included Config

- `wrangler.toml`
- `package.json`
- Worker source in `src/`
- Static assets in `frontend/`

### Variables

Current optional variable:

- `ACTIVE_MODEL=mock`

No external API secret is required for the default demo.

## API Endpoints

- `GET /`
- `GET /api/health`
- `GET /api/available-models`
- `GET /api/active-model`
- `POST /api/crawl`
- `POST /api/analyze`

## Local Tests

Run the Worker-oriented smoke tests:

```bash
npm test
```

## Known Limitations

- URL crawling is lightweight and may fail on JavaScript-heavy or bot-protected sites
- Mock extraction is deterministic and shallow compared with a real LLM backend
- D3 is loaded from a CDN
- The old Python/FastAPI files remain in the repo as legacy local artifacts, but they are no longer the cloud deployment path

## Legacy Files

Older Python backend and Docker files may still exist for local experimentation, but they are not the intended Cloudflare deployment route. Use the Worker entry plus `frontend/` assets for hosting.
