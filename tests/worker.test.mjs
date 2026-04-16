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
