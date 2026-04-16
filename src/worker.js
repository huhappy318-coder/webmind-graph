import { MODELS, analyzeInput, fetchAndExtractContent, getActiveModel } from "./webmind.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/available-models" && request.method === "GET") {
      return json({ models: MODELS });
    }

    if (url.pathname === "/api/active-model" && request.method === "GET") {
      const active = getActiveModel(env);
      const model = MODELS.find((item) => item.name === active) || MODELS.find((item) => item.name === "mock");
      return json({ active_model: active, display_name: model.display_name });
    }

    if (url.pathname === "/api/crawl" && request.method === "POST") {
      const body = await safeJson(request);
      if (!body?.url || !isProbablyUrl(body.url)) {
        return json({ detail: "A valid URL is required." }, 400);
      }
      const result = await fetchAndExtractContent(body.url);
      return json(result, result.success ? 200 : 200);
    }

    if (url.pathname === "/api/analyze" && request.method === "POST") {
      const body = await safeJson(request);
      const result = await analyzeInput(body || {}, env);
      if (result?.error) {
        return json({ detail: result.error }, result.status || 400);
      }
      return json(await result);
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, app: "webmind-graph", version: "0.3.0", runtime: "cloudflare-worker" });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return json({ ok: true, app: "webmind-graph", version: "0.3.0", runtime: "cloudflare-worker" });
  },
};

async function safeJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function isProbablyUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
