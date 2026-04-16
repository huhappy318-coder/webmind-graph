const STOP_WORDS = new Set([
  "the", "and", "for", "that", "this", "with", "from", "are", "was", "were",
  "will", "have", "has", "had", "not", "but", "you", "your", "they", "their",
  "about", "into", "more", "than", "then", "there", "these", "those", "which",
  "when", "what", "where", "who", "how", "can", "could", "would", "should",
  "also", "been", "being", "over", "under", "between", "while", "because",
  "using", "used", "use", "such", "many", "most", "some", "each", "other",
  "after", "before", "through", "across", "within",
]);

const TECH_ENTITY_HINTS = new Set([
  "python", "fastapi", "docker", "openai", "anthropic", "claude", "gemini",
  "deepseek", "qwen", "kimi", "javascript", "typescript", "react", "nodejs",
  "api", "apis", "d3", "cloudflare", "worker", "workers",
]);

const BASE_MODELS = [
  ["anthropic", "Anthropic Claude"],
  ["openai", "OpenAI GPT-4o"],
  ["gemini", "Google Gemini"],
  ["deepseek", "DeepSeek"],
  ["qwen", "Qwen/通义千问"],
  ["kimi", "Kimi/月之暗面"],
  ["mock", "Mock Model"],
];

const MODEL_ENV_VARS = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  gemini: "GEMINI_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  qwen: "QWEN_API_KEY",
  kimi: "KIMI_API_KEY",
};

const IMPLEMENTED_MODELS = new Set(["mock", "deepseek"]);

export const MODELS = BASE_MODELS.map(([name, displayName]) =>
  normalizeModelDescriptor(name, displayName, {}),
);

export function listModels(env = {}) {
  const active = getActiveModel(env);
  return BASE_MODELS.map(([name, displayName]) => {
    const descriptor = normalizeModelDescriptor(name, displayName, env);
    return {
      ...descriptor,
      default: name === active,
    };
  });
}

export function getActiveModel(env = {}) {
  return resolveUsableModel(env.ACTIVE_MODEL || "mock", env);
}

export async function fetchAndExtractContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "WebMindGraph/0.3 (+Cloudflare Worker)",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return failureResult(url, `The site returned HTTP ${response.status}.`, "Request blocked or unavailable");
    }

    const html = await response.text();
    if (!html.trim()) {
      return failureResult(url, "The response body was empty.", "Empty response");
    }

    const title = extractTitle(html, url);
    const content = extractReadableText(html).slice(0, 12000).trim();
    if (!content) {
      return failureResult(
        url,
        "The page loaded, but no readable article text could be extracted. Try pasting manual text instead.",
        title || "No readable content",
      );
    }

    return {
      title: title || url,
      url,
      content,
      summary: summarize(content),
      success: true,
      error: null,
      content_length: content.length,
      source_type: "url",
    };
  } catch (_error) {
    return failureResult(url, "Could not fetch this page. It may block bots, require JavaScript, or be temporarily unavailable.");
  }
}

export function analyzeInput({ urls = [], manual_text = "", model = "mock" }, env = {}) {
  const cleanUrls = (urls || []).map((item) => String(item).trim()).filter(Boolean);
  const text = String(manual_text || "").trim();
  if (!cleanUrls.length && !text) {
    return {
      error: "Please provide at least one URL or some manual text to analyze.",
      status: 400,
    };
  }

  return analyzeSources(cleanUrls, text, model, env);
}

export async function analyzeSources(urls, manualText, model, env = {}) {
  const articles = [];
  for (const url of urls) {
    articles.push(await fetchAndExtractContent(url));
  }

  if (manualText) {
    articles.push({
      title: "Manual Text",
      url: "manual://input",
      content: manualText,
      summary: summarize(manualText),
      success: true,
      error: null,
      content_length: manualText.length,
      source_type: "manual",
    });
  }

  const requestedModel = String(model || env.ACTIVE_MODEL || "mock").toLowerCase();
  const activeModel = normalizeModel(requestedModel, env);
  const builder = createGraphBuilder(activeModel);
  const highlights = [];
  const providerWarnings = [];
  let successCount = 0;

  for (const [index, article] of articles.entries()) {
    if (!article.success || !article.content) {
      continue;
    }
    const sourceId = article.source_type === "url" ? article.url : `manual-${index + 1}`;
    const extraction = await extractKnowledgeGraphForModel(article.content, article.title, sourceId, activeModel, env);
    mergeGraphData(builder, extraction.graph, sourceId);
    successCount += 1;
    if (extraction.summary) {
      highlights.push(`${article.title}: ${extraction.summary}`);
    }
    if (extraction.warning) {
      providerWarnings.push(extraction.warning);
    }
  }

  const graph = exportGraph(builder);
  const failedCount = articles.length - successCount;
  const success = successCount > 0;
  const providerNote = providerWarnings.length ? ` Fallbacks: ${providerWarnings.slice(0, 2).join(" ")}` : "";
  const summary = success
    ? `Processed ${articles.length} source(s): ${successCount} succeeded, ${failedCount} failed. Built a graph with ${graph.metadata.node_count} nodes and ${graph.metadata.link_count} links using ${activeModel}. Highlights: ${highlights.slice(0, 2).join(" ")}${providerNote}`
    : "No readable sources were analyzed successfully. Try another URL or paste text directly for a guaranteed demo path.";

  return {
    success,
    model: activeModel,
    articles,
    graph,
    summary: summary.slice(0, 1200),
    metadata: {
      requested_model: String(model || "mock"),
      model: activeModel,
      article_count: articles.length,
      success_count: successCount,
      failed_count: failedCount,
      node_count: graph.metadata.node_count,
      link_count: graph.metadata.link_count,
      timestamp: new Date().toISOString(),
      manual_text_used: Boolean(manualText),
      url_count: urls.length,
      provider_fallback_count: providerWarnings.length,
      provider_warnings: providerWarnings,
    },
  };
}

async function extractKnowledgeGraphForModel(text, title, sourceId, modelName, env = {}) {
  if (modelName === "deepseek" && hasEnvValue(env, "DEEPSEEK_API_KEY")) {
    try {
      return await extractKnowledgeGraphWithDeepSeek(text, title, sourceId, env);
    } catch (error) {
      const fallback = extractKnowledgeGraph(text, title, sourceId);
      fallback.warning = `DeepSeek fallback for "${title || sourceId}": ${String(error.message || error).slice(0, 180)}`;
      fallback.graph.metadata.provider = "mock";
      fallback.graph.metadata.fallback_from = "deepseek";
      return fallback;
    }
  }
  return extractKnowledgeGraph(text, title, sourceId);
}

async function extractKnowledgeGraphWithDeepSeek(text, title, sourceId, env = {}) {
  const apiKey = String(env.DEEPSEEK_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY");
  }

  const prompt = buildDeepSeekPrompt(title, text);
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: String(env.DEEPSEEK_MODEL || "deepseek-chat"),
      temperature: 0.2,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You extract a compact article knowledge graph and must respond with JSON only.",
            "Return an object with keys: summary, concepts, keywords, entities, relations.",
            "summary must be a concise string.",
            "concepts, keywords, entities must be arrays of short strings.",
            "relations must be an array of objects with source, target, relation.",
            "Allowed relation values: related_to, co_occurs_with.",
            "Use the word json and follow the requested schema strictly.",
          ].join(" "),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek returned HTTP ${response.status}: ${body.slice(0, 240)}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek returned an empty response.");
  }

  const parsed = parseJsonObject(content);
  return materializeStructuredGraph(parsed, title, sourceId, {
    provider: "deepseek",
    model: String(env.DEEPSEEK_MODEL || "deepseek-chat"),
  });
}

export function extractKnowledgeGraph(text, title = "", sourceId = "") {
  const cleanText = normalizeWhitespace(text);
  const articleId = slugify(sourceId || title || "manual-article", "article");
  const sourceRef = sourceId || articleId;
  const keywords = extractKeywords(cleanText);
  const keywordLabels = keywords.map((item) => item.keyword);
  const entities = extractEntities(cleanText, keywordLabels);
  const summary = summarize(cleanText);

  const nodes = [
    {
      id: articleId,
      label: title || "Manual Text",
      type: "article",
      weight: 3,
      sources: [sourceRef],
      metadata: { title: title || "Manual Text", kind: "article" },
    },
  ];
  const links = [];
  const seen = new Set([articleId]);
  const conceptNodes = [];
  const keywordNodes = [];

  keywords.slice(0, 6).forEach((item, index) => {
    const nodeType = index < 3 ? "concept" : "keyword";
    const nodeId = slugify(item.keyword, nodeType);
    if (seen.has(nodeId)) {
      return;
    }
    seen.add(nodeId);
    const node = {
      id: nodeId,
      label: item.keyword,
      type: nodeType,
      weight: Math.min(5, 1.1 + item.count),
      sources: [sourceRef],
      metadata: { count: item.count, rank: index + 1 },
    };
    nodes.push(node);
    if (nodeType === "concept") {
      conceptNodes.push(node);
    } else {
      keywordNodes.push(node);
    }
    links.push({
      source: articleId,
      target: nodeId,
      relation: "mentions",
      weight: node.weight,
      sources: [sourceRef],
      metadata: { rank: index + 1 },
    });
  });

  entities.slice(0, 2).forEach((entity) => {
    const nodeId = slugify(entity, "entity");
    if (seen.has(nodeId)) {
      return;
    }
    seen.add(nodeId);
    const node = {
      id: nodeId,
      label: entity,
      type: "entity",
      weight: 2.4,
      sources: [sourceRef],
      metadata: { kind: "named_entity" },
    };
    nodes.push(node);
    conceptNodes.push(node);
    links.push({
      source: articleId,
      target: nodeId,
      relation: "mentions",
      weight: 1.5,
      sources: [sourceRef],
      metadata: {},
    });
  });

  const chain = conceptNodes.slice(0, 3).concat(keywordNodes.slice(0, 2));
  for (let i = 0; i < chain.length - 1; i += 1) {
    links.push({
      source: chain[i].id,
      target: chain[i + 1].id,
      relation: "related_to",
      weight: 0.9,
      sources: [sourceRef],
      metadata: {},
    });
  }

  return {
    article_id: articleId,
    title: title || "Manual Text",
    summary,
    keywords: keywordLabels.slice(0, 6),
    graph: {
      nodes,
      links,
      metadata: {
        provider: "mock",
        keyword_count: keywords.length,
        entity_count: entities.length,
        content_length: cleanText.length,
      },
    },
  };
}

function normalizeModel(requestedModel, env = {}) {
  return resolveUsableModel(requestedModel || getActiveModel(env), env);
}

function resolveUsableModel(requestedModel, env = {}) {
  const requested = String(requestedModel || "mock").toLowerCase();
  const descriptor = BASE_MODELS.find((item) => item[0] === requested);
  if (!descriptor) {
    return "mock";
  }
  const state = normalizeModelDescriptor(descriptor[0], descriptor[1], env);
  return state.available_for_use ? state.name : "mock";
}

function normalizeModelDescriptor(name, displayName, env = {}) {
  const envVar = MODEL_ENV_VARS[name] || null;
  const implemented = IMPLEMENTED_MODELS.has(name);
  const configured = name === "mock" ? true : hasEnvValue(env, envVar);
  const available = name === "mock" ? true : implemented && configured;
  let reason = null;

  if (name !== "mock" && !configured) {
    reason = envVar ? `Set ${envVar} to enable this provider.` : "Missing provider configuration.";
  } else if (name !== "mock" && configured && !implemented) {
    reason = "API key detected, but this provider is not wired in the Cloudflare demo yet.";
  }

  return {
    name,
    display_name: displayName,
    configured,
    default: name === "mock",
    available_for_use: available,
    env_var: envVar,
    reason,
  };
}

function hasEnvValue(env, key) {
  return Boolean(key && String(env[key] || "").trim());
}

function buildDeepSeekPrompt(title, text) {
  return [
    "Please extract a compact article graph in json.",
    "Schema example:",
    '{"summary":"...","concepts":["..."],"keywords":["..."],"entities":["..."],"relations":[{"source":"...","target":"...","relation":"related_to"}]}',
    `Title: ${title || "Untitled"}`,
    `Content: ${String(text || "").slice(0, 7000)}`,
  ].join("\n\n");
}

function parseJsonObject(content) {
  const raw = String(content || "").trim();
  try {
    return JSON.parse(raw);
  } catch {
    const fencedMatch = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```([\s\S]*?)```/);
    if (fencedMatch) {
      return JSON.parse(fencedMatch[1].trim());
    }
    const objectStart = raw.indexOf("{");
    const objectEnd = raw.lastIndexOf("}");
    if (objectStart >= 0 && objectEnd > objectStart) {
      return JSON.parse(raw.slice(objectStart, objectEnd + 1));
    }
    throw new Error("Could not parse DeepSeek JSON output.");
  }
}

function materializeStructuredGraph(payload, title = "", sourceId = "", meta = {}) {
  const cleanText = normalizeWhitespace(title || sourceId || "manual");
  const articleId = slugify(sourceId || title || "manual-article", "article");
  const sourceRef = sourceId || articleId;
  const summary = normalizeWhitespace(payload?.summary || "") || summarize(cleanText);
  const concepts = normalizeTerms(payload?.concepts, 4);
  const keywords = normalizeTerms(payload?.keywords, 4);
  const entities = normalizeTerms(payload?.entities, 3);
  const relationSeed = Array.isArray(payload?.relations) ? payload.relations : [];

  const nodes = [
    {
      id: articleId,
      label: title || "Manual Text",
      type: "article",
      weight: 3,
      sources: [sourceRef],
      metadata: { title: title || "Manual Text", kind: "article" },
    },
  ];
  const links = [];
  const seen = new Set([articleId]);
  const labelToNodeId = new Map();

  const ensureNode = (label, type, weight = 1.8, metadata = {}) => {
    const normalized = normalizeWhitespace(label);
    if (!normalized) {
      return null;
    }
    const nodeId = slugify(normalized, type);
    if (!seen.has(nodeId)) {
      seen.add(nodeId);
      nodes.push({
        id: nodeId,
        label: normalized,
        type,
        weight,
        sources: [sourceRef],
        metadata,
      });
      links.push({
        source: articleId,
        target: nodeId,
        relation: "mentions",
        weight,
        sources: [sourceRef],
        metadata: {},
      });
    }
    labelToNodeId.set(normalized.toLowerCase(), nodeId);
    return nodeId;
  };

  concepts.forEach((item, index) => ensureNode(item, "concept", 2.2 - index * 0.2, { rank: index + 1 }));
  keywords.forEach((item, index) => ensureNode(item, "keyword", 1.6 - index * 0.1, { rank: index + 1 }));
  entities.forEach((item, index) => ensureNode(item, "entity", 2.4 - index * 0.2, { rank: index + 1 }));

  relationSeed.slice(0, 8).forEach((relation) => {
    const sourceLabel = normalizeWhitespace(relation?.source || "");
    const targetLabel = normalizeWhitespace(relation?.target || "");
    const relationType = normalizeRelation(relation?.relation);
    if (!sourceLabel || !targetLabel || sourceLabel.toLowerCase() === targetLabel.toLowerCase()) {
      return;
    }
    const sourceNode = labelToNodeId.get(sourceLabel.toLowerCase()) || ensureNode(sourceLabel, "concept", 1.5, { inferred: true });
    const targetNode = labelToNodeId.get(targetLabel.toLowerCase()) || ensureNode(targetLabel, "concept", 1.5, { inferred: true });
    if (!sourceNode || !targetNode) {
      return;
    }
    links.push({
      source: sourceNode,
      target: targetNode,
      relation: relationType,
      weight: relationType === "co_occurs_with" ? 0.8 : 1.1,
      sources: [sourceRef],
      metadata: { provider: meta.provider || "deepseek" },
    });
  });

  return {
    article_id: articleId,
    title: title || "Manual Text",
    summary,
    keywords: keywords.slice(0, 6),
    graph: {
      nodes,
      links,
      metadata: {
        provider: meta.provider || "deepseek",
        model: meta.model || "deepseek-chat",
        content_length: String(title || sourceId || "").length,
      },
    },
  };
}

function normalizeTerms(values, limit = 6) {
  const items = Array.isArray(values) ? values : [];
  return uniqueBy(
    items
      .map((item) => normalizeWhitespace(item))
      .filter((item) => item && item.length >= 2)
      .slice(0, limit),
    (item) => item.toLowerCase(),
  );
}

function normalizeRelation(value) {
  const relation = String(value || "related_to").toLowerCase();
  return relation === "co_occurs_with" ? "co_occurs_with" : "related_to";
}

function extractKeywords(text) {
  const tokens = text.toLowerCase().match(/[a-z][a-z0-9_-]{2,}|[\u4e00-\u9fff]{2,}/g) || [];
  const counts = new Map();
  for (const rawToken of tokens) {
    const token = rawToken.replace(/^[-_]+|[-_]+$/g, "");
    if (!token || STOP_WORDS.has(token) || /^\d+$/.test(token)) {
      continue;
    }
    if (token.endsWith("ing") && token.length <= 5) {
      continue;
    }
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 14)
    .map(([keyword, count]) => ({ keyword, count }));
}

function extractEntities(text, keywordLabels) {
  const keywordSet = new Set(keywordLabels.map((item) => item.toLowerCase()));
  const entities = [];
  const patterns = [
    /\b([A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9]+){1,2})\b/g,
    /\b([A-Z]{2,}(?:\s+[A-Z]{2,})*)\b/g,
    /\b([A-Z][a-z]+[A-Z][A-Za-z0-9]*)\b/g,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const candidate = String(match[1] || "").trim();
      if (isValidEntity(candidate, keywordSet)) {
        entities.push(candidate);
      }
    }
  }

  return uniqueBy(entities, (item) => item.toLowerCase());
}

function isValidEntity(candidate, keywordSet) {
  if (!candidate || candidate.length < 3) {
    return false;
  }
  const lowered = candidate.toLowerCase();
  if (STOP_WORDS.has(lowered) || keywordSet.has(lowered)) {
    return false;
  }

  const parts = candidate.split(/\s+/);
  if (parts.length === 1) {
    const token = parts[0];
    if (!TECH_ENTITY_HINTS.has(lowered) && !/^[A-Z]{2,}$/.test(token) && !/[a-z][A-Z]/.test(token)) {
      return false;
    }
    if (/^[A-Z][a-z]+$/.test(token) && !TECH_ENTITY_HINTS.has(lowered)) {
      return false;
    }
  }

  return !parts.every((part) => STOP_WORDS.has(part.toLowerCase()));
}

function createGraphBuilder(modelName) {
  return {
    modelName,
    nodes: new Map(),
    links: new Map(),
    articleIds: new Set(),
    aliases: new Map(),
  };
}

function mergeGraphData(builder, graphData, articleId = "") {
  const idMap = new Map();
  const meta = graphData.metadata || {};

  for (const rawNode of graphData.nodes || []) {
    const node = normalizeNode(rawNode);
    const canonicalId = canonicalNodeId(node);
    idMap.set(node.id, canonicalId);
    idMap.set(node.label, canonicalId);
    builder.aliases.set(node.id, canonicalId);
    builder.aliases.set(node.label, canonicalId);
    if (node.type === "article") {
      builder.articleIds.add(canonicalId);
    }

    const sources = mergeSources(node.sources, articleId ? [articleId] : []);
    if (builder.nodes.has(canonicalId)) {
      const existing = builder.nodes.get(canonicalId);
      existing.weight = Math.max(existing.weight, node.weight);
      existing.sources = mergeSources(existing.sources, sources);
      existing.metadata = { ...existing.metadata, ...node.metadata };
      if (node.label.length > existing.label.length) {
        existing.label = node.label;
      }
    } else {
      builder.nodes.set(canonicalId, {
        ...node,
        id: canonicalId,
        sources,
        metadata: {
          original_id: rawNode.id || node.id,
          provider: meta.provider || "mock",
          ...node.metadata,
        },
      });
    }
  }

  for (const rawLink of graphData.links || []) {
    const link = normalizeLink(rawLink);
    const source = idMap.get(link.source) || builder.aliases.get(link.source) || canonicalTextId(link.source, "concept");
    const target = idMap.get(link.target) || builder.aliases.get(link.target) || canonicalTextId(link.target, "concept");
    if (source === target) {
      continue;
    }
    const [orderedSource, orderedTarget] = normalizeDirection(source, target, link.relation);
    const key = `${orderedSource}::${orderedTarget}::${link.relation}`;
    if (builder.links.has(key)) {
      const existing = builder.links.get(key);
      existing.weight = Math.max(existing.weight, link.weight);
      existing.sources = mergeSources(existing.sources, link.sources, articleId ? [articleId] : []);
      existing.metadata = { ...existing.metadata, ...link.metadata };
    } else {
      builder.links.set(key, {
        ...link,
        source: orderedSource,
        target: orderedTarget,
        sources: mergeSources(link.sources, articleId ? [articleId] : []),
      });
    }
  }

  addCooccurrenceEdges(builder, articleId);
}

function addCooccurrenceEdges(builder, articleId) {
  if (!articleId) {
    return;
  }
  const conceptNodes = [...builder.nodes.values()]
    .filter((node) => node.sources.includes(articleId) && (node.type === "concept" || node.type === "entity"))
    .sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label))
    .slice(0, 4);

  for (let index = 0; index < conceptNodes.length; index += 1) {
    for (let offset = index + 1; offset < Math.min(conceptNodes.length, index + 3); offset += 1) {
      const [source, target] = normalizeDirection(conceptNodes[index].id, conceptNodes[offset].id, "co_occurs_with");
      const key = `${source}::${target}::co_occurs_with`;
      if (builder.links.has(key)) {
        const existing = builder.links.get(key);
        existing.sources = mergeSources(existing.sources, [articleId]);
        continue;
      }
      builder.links.set(key, {
        source,
        target,
        relation: "co_occurs_with",
        weight: 0.8,
        sources: [articleId],
        metadata: { derived: true },
      });
    }
  }
}

function exportGraph(builder) {
  const nodes = [...builder.nodes.values()].sort((a, b) => {
    if (a.type === "article" && b.type !== "article") return -1;
    if (a.type !== "article" && b.type === "article") return 1;
    return b.weight - a.weight || a.label.localeCompare(b.label);
  });
  const links = [...builder.links.values()].sort((a, b) => {
    return a.relation.localeCompare(b.relation) || a.source.localeCompare(b.source) || a.target.localeCompare(b.target);
  });
  return {
    nodes,
    links,
    metadata: {
      model: builder.modelName,
      article_count: builder.articleIds.size,
      node_count: nodes.length,
      link_count: links.length,
      generated_at: new Date().toISOString(),
    },
  };
}

function normalizeNode(node) {
  return {
    id: String(node.id || node.label || "node"),
    label: String(node.label || node.id || "Node"),
    type: String(node.type || "concept"),
    weight: Number(node.weight || 1),
    sources: Array.isArray(node.sources) ? node.sources : [],
    metadata: node.metadata || {},
  };
}

function normalizeLink(link) {
  return {
    source: String(link.source),
    target: String(link.target),
    relation: String(link.relation || link.type || "related_to"),
    weight: Number(link.weight || 1),
    sources: Array.isArray(link.sources) ? link.sources : [],
    metadata: link.metadata || {},
  };
}

function normalizeDirection(source, target, relation) {
  if ((relation === "related_to" || relation === "co_occurs_with") && source > target) {
    return [target, source];
  }
  return [source, target];
}

function canonicalNodeId(node) {
  const prefix = node.type === "article" ? "article" : node.type;
  const basis = node.type === "article" ? node.id : (node.label || node.id);
  return canonicalTextId(basis, prefix);
}

function canonicalTextId(value, prefix = "concept") {
  const text = String(value || "")
    .toLowerCase()
    .replace(/^(article|concept|keyword|entity)-/, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${prefix}-${text || "item"}`.slice(0, 72);
}

function mergeSources(...sourceLists) {
  const merged = [];
  const seen = new Set();
  for (const list of sourceLists) {
    for (const source of list || []) {
      if (!source || seen.has(source)) continue;
      seen.add(source);
      merged.push(source);
    }
  }
  return merged;
}

function extractTitle(html, fallbackUrl) {
  const metaMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i);
  if (metaMatch) {
    return cleanHtml(metaMatch[1]);
  }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return cleanHtml(titleMatch[1]);
  }
  const headingMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  return headingMatch ? cleanHtml(headingMatch[1]) : fallbackUrl;
}

function extractReadableText(html) {
  const candidates = [];
  const patterns = [
    /<article\b[^>]*>([\s\S]*?)<\/article>/gi,
    /<main\b[^>]*>([\s\S]*?)<\/main>/gi,
    /<body\b[^>]*>([\s\S]*?)<\/body>/i,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const text = cleanHtml(match[1] || "");
      if (text.length >= 180) {
        candidates.push(text);
      }
    }
    if (candidates.length) {
      break;
    }
  }

  if (!candidates.length) {
    const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => cleanHtml(match[1] || ""))
      .filter((text) => text.length >= 80);
    candidates.push(...paragraphs);
  }

  if (!candidates.length) {
    return cleanHtml(html);
  }

  return candidates.sort((a, b) => b.length - a.length)[0];
}

function cleanHtml(html) {
  return normalizeWhitespace(
    String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">"),
  );
}

function summarize(text) {
  const sentences = String(text || "")
    .split(/(?<=[.!?\u3002\uff01\uff1f])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const summary = sentences.slice(0, 3).join(" ");
  return (summary || String(text || "")).slice(0, 420);
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

function failureResult(url, message, title = "Fetch failed") {
  return {
    title,
    url,
    content: "",
    summary: message,
    success: false,
    error: message,
    content_length: 0,
    source_type: "url",
  };
}

function slugify(value, prefix) {
  const clean = String(value || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${prefix}-${clean || "item"}`.slice(0, 72);
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}
