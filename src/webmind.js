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

export const MODELS = BASE_MODELS.map(([name, displayName]) => ({
  name,
  display_name: displayName,
  configured: name === "mock",
  default: name === "mock",
  available_for_use: name === "mock",
  reason: name === "mock" ? null : "Provider wiring is not enabled in this Cloudflare demo yet.",
}));

export function listModels(env = {}) {
  return BASE_MODELS.map(([name, displayName]) => ({
    name,
    display_name: displayName,
    configured: name === "mock",
    default: name === getActiveModel(env),
    available_for_use: name === "mock",
    reason: name === "mock" ? null : "Coming soon in the hosted demo.",
  }));
}

export function getActiveModel(env = {}) {
  const requested = String(env.ACTIVE_MODEL || "mock").toLowerCase();
  const exists = BASE_MODELS.find((item) => item[0] === requested);
  return exists ? requested : "mock";
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

  const activeModel = normalizeModel(model, env);
  const builder = createGraphBuilder(activeModel);
  const highlights = [];
  let successCount = 0;

  articles.forEach((article, index) => {
    if (!article.success || !article.content) {
      return;
    }
    const sourceId = article.source_type === "url" ? article.url : `manual-${index + 1}`;
    const extraction = extractKnowledgeGraph(article.content, article.title, sourceId);
    mergeGraphData(builder, extraction.graph, sourceId);
    successCount += 1;
    if (extraction.summary) {
      highlights.push(`${article.title}: ${extraction.summary}`);
    }
  });

  const graph = exportGraph(builder);
  const failedCount = articles.length - successCount;
  const success = successCount > 0;
  const summary = success
    ? `Processed ${articles.length} source(s): ${successCount} succeeded, ${failedCount} failed. Built a graph with ${graph.metadata.node_count} nodes and ${graph.metadata.link_count} links. Highlights: ${highlights.slice(0, 2).join(" ")}`
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
    },
  };
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
  const availableModels = listModels(env);
  const requested = String(requestedModel || getActiveModel(env)).toLowerCase();
  return availableModels.some((item) => item.name === requested && item.available_for_use) ? requested : "mock";
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
