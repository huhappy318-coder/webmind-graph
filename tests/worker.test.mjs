import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/worker.js";


function createEnv() {
  return {
    ACTIVE_MODEL: "mock",
    ASSETS: {
      fetch(request) {
        const url = new URL(request.url);
        if (url.pathname === "/" || url.pathname === "/index.html") {
          return new Response("<!doctype html><title>WebMind Graph</title><div id='modelSelector'></div>", {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
        if (url.pathname === "/style.css") {
          return new Response("body{}", { headers: { "content-type": "text/css" } });
        }
        return new Response("not found", { status: 404 });
      },
    },
  };
}

function createDeepSeekResponse() {
  return new Response(JSON.stringify({
    choices: [
      {
        message: {
          content: JSON.stringify({
            summary: "DeepSeek extracted a concise graph.",
            concepts: ["知识图谱", "文章分析"],
            keywords: ["DeepSeek", "Cloudflare"],
            entities: ["WebMind Graph"],
            relations: [
              { source: "知识图谱", target: "文章分析", relation: "related_to" },
              { source: "DeepSeek", target: "Cloudflare", relation: "co_occurs_with" },
            ],
          }),
        },
      },
    ],
  }), {
    headers: { "content-type": "application/json" },
  });
}

test("available models endpoint works", async () => {
  const response = await worker.fetch(new Request("https://example.dev/api/available-models"), createEnv());
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.ok(Array.isArray(data.models));
  assert.ok(data.models.some((item) => item.name === "mock"));
});

test("active model endpoint works", async () => {
  const response = await worker.fetch(new Request("https://example.dev/api/active-model"), createEnv());
  const data = await response.json();
  assert.equal(data.active_model, "mock");
});

test("deepseek becomes available when a key exists", async () => {
  const env = createEnv();
  env.ACTIVE_MODEL = "deepseek";
  env.DEEPSEEK_API_KEY = "test-key";
  const response = await worker.fetch(new Request("https://example.dev/api/available-models"), env);
  const data = await response.json();
  const deepseek = data.models.find((item) => item.name === "deepseek");
  assert.equal(deepseek.available_for_use, true);
  assert.equal(deepseek.default, true);
});

test("analyze accepts manual text", async () => {
  const request = new Request("https://example.dev/api/analyze", {
    method: "POST",
    body: JSON.stringify({
      urls: [],
      manual_text: "Knowledge graphs connect articles, keywords, and entities.",
      model: "mock",
    }),
    headers: { "content-type": "application/json" },
  });
  const response = await worker.fetch(request, createEnv());
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.success, true);
  assert.ok(data.graph.nodes.length > 0);
  assert.ok(data.metadata.node_count > 0);
});

test("analyze uses deepseek when configured", async () => {
  const env = createEnv();
  env.ACTIVE_MODEL = "deepseek";
  env.DEEPSEEK_API_KEY = "test-key";

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    if (String(input).startsWith("https://api.deepseek.com/chat/completions")) {
      return createDeepSeekResponse();
    }
    return originalFetch(input);
  };

  try {
    const request = new Request("https://example.dev/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        urls: [],
        manual_text: "Use DeepSeek to analyze this article about graph extraction.",
        model: "deepseek",
      }),
      headers: { "content-type": "application/json" },
    });
    const response = await worker.fetch(request, env);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.model, "deepseek");
    assert.ok(data.graph.nodes.some((item) => item.label === "知识图谱"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("analyze rejects empty input", async () => {
  const request = new Request("https://example.dev/api/analyze", {
    method: "POST",
    body: JSON.stringify({ urls: [], manual_text: "", model: "mock" }),
    headers: { "content-type": "application/json" },
  });
  const response = await worker.fetch(request, createEnv());
  assert.equal(response.status, 400);
});

test("root can be served by assets binding", async () => {
  const response = await worker.fetch(new Request("https://example.dev/"), createEnv());
  assert.equal(response.status, 200);
  assert.match(await response.text(), /WebMind Graph/);
});
