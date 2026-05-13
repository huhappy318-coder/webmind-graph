(function () {
  const COPY = {
    bilingual: {
      heroText: "对比 URL 或粘贴文本，生成轻量级文章知识图谱。 / Compare URLs or pasted text and inspect a lightweight article knowledge graph.",
      stepOne: "1. 输入内容 / Input",
      stepTwo: "2. 选择模型 / Model",
      stepThree: "3. 生成图谱 / Graph",
      languageLabel: "语言 / Language",
      modelLabel: "模型 / Model",
      modelHelpSingle: "当前演示可直接使用模拟模型。配置真实 API Key 后，对应模型会自动启用。 / The hosted demo always works with mock mode. Models unlock when API keys are configured.",
      modelHelpMulti: "可切换已启用模型；未启用项会标记为即将支持。 / Switch enabled models. Disabled items are marked as coming soon.",
      comingSoonSuffix: "（未启用） / (not enabled)",
      copied: "已复制摘要 / Summary copied",
      copyFailed: "复制失败，请手动选择文本复制。 / Copy failed. Select the text manually.",
      exported: "已导出 JSON / JSON exported",
      exportEmpty: "还没有分析结果，将导出当前输入。 / No result yet; exporting current input.",
      cleared: "已清空本地数据 / Local data cleared",
      sampleLoaded: "已填入示例 / Example loaded",
      sampleButton: "填入示例 / Example",
      copyButton: "复制摘要 / Copy",
      exportButton: "导出 JSON / Export",
      clearButton: "清空 / Clear",
      inputTitle: "输入 / Input",
      ready: "就绪 / Ready",
      waitingInput: "等待输入 / Waiting for input",
      analyzing: "正在分析 / Analyzing sources...",
      analyzingSummary: "正在处理内容并构建图谱... / Working through the content and building a graph...",
      analysisComplete: "分析完成 / Analysis complete",
      analysisPartial: "已返回部分结果 / Partial results returned",
      analysisNoGraph: "分析完成，但没有生成图谱数据 / Analysis finished, but no graph data was created",
      analysisFailed: "分析失败 / Analysis failed",
      crawlWaiting: "等待 URL / Waiting for URL",
      crawlLoading: "抓取测试中 / Testing crawl...",
      crawlSuccess: "抓取成功 / Crawl succeeded",
      crawlFallback: "抓取失败，已返回降级提示 / Crawl returned fallback guidance",
      crawlFailed: "抓取失败 / Crawl failed",
      urlsLabel: "URL（每行一个） / URLs (one per line)",
      urlsPlaceholder: "在这里粘贴一个或多个文章链接。示例：\nhttps://example.com\nhttps://www.python.org/about/\n\nPaste one or more article URLs here.",
      manualTextLabel: "手动文本 / Manual text",
      manualTextPlaceholder: "当网页抓取失败、页面依赖 JavaScript 渲染，或你只想快速演示时，可直接粘贴正文。\n\nPaste article text here when scraping is blocked or you want a quick demo.",
      analyzeButton: "开始分析 / Start Analysis",
      analyzeBusy: "分析中... / Analyzing...",
      crawlButton: "抓取测试 / Test Crawl",
      summaryTitle: "运行摘要 / Run Summary",
      summaryEmpty: "还没有分析结果。 / No analysis yet.",
      articlesTitle: "文章列表 / Articles",
      articlesEmpty: "还没有文章详情。 / No article details yet.",
      graphTitle: "知识图谱 / Knowledge Graph",
      footerNote: "演示版默认使用 mock 模型；配置 DeepSeek API Key 后可切换真实模型。 / The demo uses mock mode by default; add a DeepSeek API key to enable a real model.",
      needInputError: "请至少输入一个 URL 或一段手动文本后再开始分析。 / Please add at least one URL or some manual text before starting analysis.",
      shortInputWarning: "输入内容较短，图谱可能比较简单。 / The input is short; the graph may be simple.",
      needUrlError: "请先输入至少一个 URL 再测试抓取。 / Add at least one URL first to test crawling.",
      invalidUrls: "已忽略无效 URL： / Ignored invalid URLs: ",
      noSummary: "暂无摘要。 / No summary available.",
      noSummaryReturned: "接口未返回摘要。 / No summary returned.",
      apiFallback: "模型列表加载失败，已切换到本地模拟模型。 / Model list failed; using local mock model.",
      initFailed: "初始化失败 / Init failed",
      analyzeRequestFailed: "分析请求失败 / Analyze request failed",
      crawlRequestFailed: "抓取请求失败 / Crawl failed",
      articleUntitled: "未命名文章 / Untitled",
      sourceLabel: "来源 / Source",
      lengthLabel: "长度 / Length",
      statusLabel: "状态 / Status",
      sourceUrl: "链接 / URL",
      sourceManual: "手动 / Manual",
      articleStatusOk: "成功 / ok",
      articleStatusFailed: "失败 / failed",
      statTotal: "总数 / Total",
      statSuccess: "成功 / Success",
      statFailed: "失败 / Failed",
      statNodes: "节点 / Nodes",
      statLinks: "连线 / Links",
      statModel: "模型 / Model",
    },
    zh: {
      heroText: "对比 URL 或粘贴文本，生成轻量级文章知识图谱。",
      stepOne: "1. 输入内容",
      stepTwo: "2. 选择模型",
      stepThree: "3. 生成图谱",
      languageLabel: "语言",
      modelLabel: "模型",
      modelHelpSingle: "当前演示可直接使用模拟模型。配置真实 API Key 后，对应模型会自动启用。",
      modelHelpMulti: "可切换已启用模型；未启用项会标记为即将支持。",
      comingSoonSuffix: "（未启用）",
      copied: "已复制摘要",
      copyFailed: "复制失败，请手动选择文本复制。",
      exported: "已导出 JSON",
      exportEmpty: "还没有分析结果，将导出当前输入。",
      cleared: "已清空本地数据",
      sampleLoaded: "已填入示例",
      sampleButton: "填入示例",
      copyButton: "复制摘要",
      exportButton: "导出 JSON",
      clearButton: "清空",
      inputTitle: "输入",
      ready: "就绪",
      waitingInput: "等待输入",
      analyzing: "正在分析",
      analyzingSummary: "正在处理内容并构建图谱...",
      analysisComplete: "分析完成",
      analysisPartial: "已返回部分结果",
      analysisNoGraph: "分析完成，但没有生成图谱数据",
      analysisFailed: "分析失败",
      crawlWaiting: "等待 URL",
      crawlLoading: "抓取测试中",
      crawlSuccess: "抓取成功",
      crawlFallback: "抓取失败，已返回降级提示",
      crawlFailed: "抓取失败",
      urlsLabel: "URL（每行一个）",
      urlsPlaceholder: "在这里粘贴一个或多个文章链接。示例：\nhttps://example.com\nhttps://www.python.org/about/",
      manualTextLabel: "手动文本",
      manualTextPlaceholder: "当网页抓取失败、页面依赖 JavaScript 渲染，或你只想快速演示时，可直接粘贴正文。",
      analyzeButton: "开始分析",
      analyzeBusy: "分析中...",
      crawlButton: "抓取测试",
      summaryTitle: "运行摘要",
      summaryEmpty: "还没有分析结果。",
      articlesTitle: "文章列表",
      articlesEmpty: "还没有文章详情。",
      graphTitle: "知识图谱",
      footerNote: "演示版默认使用 mock 模型；配置 DeepSeek API Key 后可切换真实模型。",
      needInputError: "请至少输入一个 URL 或一段手动文本后再开始分析。",
      shortInputWarning: "输入内容较短，图谱可能比较简单。",
      needUrlError: "请先输入至少一个 URL 再测试抓取。",
      invalidUrls: "已忽略无效 URL：",
      noSummary: "暂无摘要。",
      noSummaryReturned: "接口未返回摘要。",
      apiFallback: "模型列表加载失败，已切换到本地模拟模型。",
      initFailed: "初始化失败",
      analyzeRequestFailed: "分析请求失败",
      crawlRequestFailed: "抓取请求失败",
      articleUntitled: "未命名文章",
      sourceLabel: "来源",
      lengthLabel: "长度",
      statusLabel: "状态",
      sourceUrl: "链接",
      sourceManual: "手动",
      articleStatusOk: "成功",
      articleStatusFailed: "失败",
      statTotal: "总数",
      statSuccess: "成功",
      statFailed: "失败",
      statNodes: "节点",
      statLinks: "连线",
      statModel: "模型",
    },
    en: {
      heroText: "Compare URLs or pasted text and inspect a lightweight article knowledge graph.",
      stepOne: "1. Input",
      stepTwo: "2. Model",
      stepThree: "3. Graph",
      languageLabel: "Language",
      modelLabel: "Model",
      modelHelpSingle: "The hosted demo always works with mock mode. Models unlock when API keys are configured.",
      modelHelpMulti: "Switch enabled models. Disabled items are marked as coming soon.",
      comingSoonSuffix: "(not enabled)",
      copied: "Summary copied",
      copyFailed: "Copy failed. Select the text manually.",
      exported: "JSON exported",
      exportEmpty: "No result yet; exporting current input.",
      cleared: "Local data cleared",
      sampleLoaded: "Example loaded",
      sampleButton: "Example",
      copyButton: "Copy Summary",
      exportButton: "Export JSON",
      clearButton: "Clear",
      inputTitle: "Input",
      ready: "Ready",
      waitingInput: "Waiting for input",
      analyzing: "Analyzing sources...",
      analyzingSummary: "Working through the content and building a graph...",
      analysisComplete: "Analysis complete",
      analysisPartial: "Partial results returned",
      analysisNoGraph: "Analysis finished, but no graph data was created",
      analysisFailed: "Analysis failed",
      crawlWaiting: "Waiting for URL",
      crawlLoading: "Testing crawl...",
      crawlSuccess: "Crawl succeeded",
      crawlFallback: "Crawl returned fallback guidance",
      crawlFailed: "Crawl failed",
      urlsLabel: "URLs (one per line)",
      urlsPlaceholder: "Paste one or more article URLs here.\nExample:\nhttps://example.com\nhttps://www.python.org/about/",
      manualTextLabel: "Manual text",
      manualTextPlaceholder: "Paste article text here when scraping is blocked, the page needs JavaScript rendering, or you want a quick demo.",
      analyzeButton: "Start Analysis",
      analyzeBusy: "Analyzing...",
      crawlButton: "Test Crawl",
      summaryTitle: "Run Summary",
      summaryEmpty: "No analysis yet.",
      articlesTitle: "Articles",
      articlesEmpty: "No article details yet.",
      graphTitle: "Knowledge Graph",
      footerNote: "The demo uses mock mode by default; add a DeepSeek API key to enable a real model.",
      needInputError: "Please add at least one URL or some manual text before starting analysis.",
      shortInputWarning: "The input is short; the graph may be simple.",
      needUrlError: "Add at least one URL first to test crawling.",
      invalidUrls: "Ignored invalid URLs: ",
      noSummary: "No summary available.",
      noSummaryReturned: "No summary returned.",
      apiFallback: "Model list failed; using local mock model.",
      initFailed: "Init failed",
      analyzeRequestFailed: "Analyze request failed",
      crawlRequestFailed: "Crawl failed",
      articleUntitled: "Untitled",
      sourceLabel: "Source",
      lengthLabel: "Length",
      statusLabel: "Status",
      sourceUrl: "URL",
      sourceManual: "Manual",
      articleStatusOk: "ok",
      articleStatusFailed: "failed",
      statTotal: "Total",
      statSuccess: "Success",
      statFailed: "Failed",
      statNodes: "Nodes",
      statLinks: "Links",
      statModel: "Model",
    },
  };

  const $ = (id) => document.getElementById(id);
  const modelSelector = $("modelSelector");
  const modelHelp = $("modelHelp");
  const languageSelector = $("languageSelector");
  const urlInput = $("urlInput");
  const manualText = $("manualText");
  const summary = $("summary");
  const articles = $("articles");
  const status = $("status");
  const errorBox = $("errorBox");
  const analyzeButton = $("analyzeButton");
  const crawlButton = $("crawlButton");
  const sampleButton = $("sampleButton");
  const copyButton = $("copyButton");
  const exportButton = $("exportButton");
  const clearButton = $("clearButton");
  const statArticles = $("statArticles");
  const statSuccess = $("statSuccess");
  const statFailed = $("statFailed");
  const statNodes = $("statNodes");
  const statLinks = $("statLinks");
  const statModel = $("statModel");

  const STORAGE_KEY = "webmind-graph-state-v1";
  const LANGUAGE_KEY = "webmind-language";
  const MAX_MANUAL_TEXT = 30000;
  let currentLanguage = detectLanguage();
  let busy = false;

  async function init() {
    languageSelector.value = currentLanguage;
    applyLanguage();
    await loadModels();
    bindEvents();
    if (!restoreState()) {
      resetDashboard();
      window.renderGraph?.({ nodes: [], links: [], metadata: {} });
    }
  }

  async function loadModels() {
    let data;
    try {
      const response = await fetch("/api/available-models");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
    } catch (error) {
      data = {
        models: [{
          name: "mock",
          display_name: "Mock Model",
          available_for_use: true,
          configured: true,
          default: true,
        }],
      };
      setStatus(`${t("apiFallback")} ${error.message || ""}`.trim(), "warning");
    }

    const models = Array.isArray(data.models) ? data.models : [];
    modelSelector.innerHTML = "";
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.name;
      option.textContent = model.available_for_use
        ? model.display_name
        : `${model.display_name} ${t("comingSoonSuffix")}`.trim();
      option.disabled = !model.available_for_use;
      option.selected = Boolean(model.default);
      modelSelector.appendChild(option);
    });

    const activeModel = models.find((item) => item.available_for_use && item.default)
      || models.find((item) => item.available_for_use)
      || models.find((item) => item.name === "mock");
    modelSelector.value = activeModel ? activeModel.name : "mock";
    const enabledCount = models.filter((item) => item.available_for_use).length;
    modelSelector.disabled = enabledCount <= 1;
    modelHelp.textContent = enabledCount <= 1 ? t("modelHelpSingle") : t("modelHelpMulti");
  }

  function bindEvents() {
    analyzeButton.addEventListener("click", analyze);
    crawlButton.addEventListener("click", crawlFirstUrl);
    sampleButton.addEventListener("click", loadExample);
    copyButton.addEventListener("click", copySummary);
    exportButton.addEventListener("click", exportJson);
    clearButton.addEventListener("click", clearLocalData);
    urlInput.addEventListener("input", debounce(saveDraft, 250));
    manualText.addEventListener("input", debounce(saveDraft, 250));
    modelSelector.addEventListener("change", saveDraft);
    languageSelector.addEventListener("change", () => {
      currentLanguage = languageSelector.value || "bilingual";
      applyLanguage();
      renderArticles(getCurrentArticles());
      window.renderGraph?.(window.__lastGraphData || { nodes: [], links: [], metadata: {} });
      saveDraft();
    });
  }

  async function analyze() {
    if (busy) return;
    const payload = buildPayload();
    clearError();
    if (!payload.urls.length && !payload.manual_text.trim()) {
      showError(t("needInputError"));
      setStatus(t("waitingInput"), "warning");
      return;
    }
    if (payload.manual_text.trim() && payload.manual_text.trim().length < 20 && !payload.urls.length) {
      setStatus(t("shortInputWarning"), "warning");
    }
    if (payload.invalid_urls.length) {
      showError(`${t("invalidUrls")}${payload.invalid_urls.join(", ")}`);
    }

    setBusy(true);
    setStatus(t("analyzing"), "loading");
    summary.textContent = t("analyzingSummary");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: payload.urls, manual_text: payload.manual_text, model: payload.model }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || t("analyzeRequestFailed"));

      window.__lastGraphData = data.graph || { nodes: [], links: [], metadata: {} };
      window.__lastArticles = data.articles || [];
      window.__lastResult = data;
      summary.textContent = data.summary || t("noSummaryReturned");
      renderArticles(window.__lastArticles);
      updateStats(data.metadata || {}, data.model || "mock");
      window.renderGraph?.(window.__lastGraphData);

      if (!window.__lastGraphData.nodes || !window.__lastGraphData.nodes.length) {
        setStatus(t("analysisNoGraph"), "warning");
      } else {
        setStatus(data.success ? t("analysisComplete") : t("analysisPartial"), data.success ? "success" : "warning");
      }
      saveDraft();
    } catch (error) {
      resetDashboard();
      window.renderGraph?.({ nodes: [], links: [], metadata: {} });
      summary.textContent = t("noSummary");
      showError(error.message || String(error));
      setStatus(t("analysisFailed"), "error");
    } finally {
      setBusy(false);
    }
  }

  async function crawlFirstUrl() {
    if (busy) return;
    const payload = buildPayload();
    clearError();
    if (!payload.urls.length) {
      showError(t("needUrlError"));
      setStatus(t("crawlWaiting"), "warning");
      return;
    }

    setBusy(true);
    setStatus(t("crawlLoading"), "loading");
    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: payload.urls[0] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || t("crawlRequestFailed"));

      window.__lastArticles = [data];
      window.__lastGraphData = { nodes: [], links: [], metadata: {} };
      window.__lastResult = {
        success: data.success,
        model: payload.model,
        articles: [data],
        graph: window.__lastGraphData,
        summary: data.summary || "",
        metadata: {
          article_count: 1,
          success_count: data.success ? 1 : 0,
          failed_count: data.success ? 0 : 1,
          node_count: 0,
          link_count: 0,
          model: payload.model,
        },
      };

      summary.textContent = data.summary || t("noSummaryReturned");
      renderArticles(window.__lastArticles);
      updateStats(window.__lastResult.metadata, payload.model);
      window.renderGraph?.(window.__lastGraphData);
      if (!data.success && data.error) showError(data.error);
      setStatus(data.success ? t("crawlSuccess") : t("crawlFallback"), data.success ? "success" : "warning");
      saveDraft();
    } catch (error) {
      showError(`${t("crawlFailed")}: ${error.message || error}`);
      setStatus(t("crawlFailed"), "error");
    } finally {
      setBusy(false);
    }
  }

  function buildPayload() {
    const parsed = parseUrls(urlInput.value);
    const text = manualText.value.length > MAX_MANUAL_TEXT
      ? manualText.value.slice(0, MAX_MANUAL_TEXT)
      : manualText.value;
    return {
      urls: parsed.valid,
      invalid_urls: parsed.invalid,
      manual_text: text,
      model: modelSelector.value || "mock",
    };
  }

  function renderArticles(items) {
    articles.innerHTML = "";
    if (!items.length) {
      articles.innerHTML = `<div class="article-card muted">${escapeHtml(t("articlesEmpty"))}</div>`;
      return;
    }
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = `article-card ${item.success ? "" : "article-card-failed"}`.trim();
      const sourceType = item.source_type === "manual" ? t("sourceManual") : t("sourceUrl");
      card.innerHTML = `
        <h3>${escapeHtml(item.title || t("articleUntitled"))}</h3>
        <p>${escapeHtml(item.summary || "")}</p>
        <dl>
          <div><dt>${escapeHtml(t("sourceLabel"))}</dt><dd>${escapeHtml(sourceType)}</dd></div>
          <div><dt>${escapeHtml(t("lengthLabel"))}</dt><dd>${Number(item.content_length || 0).toLocaleString()}</dd></div>
          <div><dt>${escapeHtml(t("statusLabel"))}</dt><dd>${item.success ? escapeHtml(t("articleStatusOk")) : escapeHtml(t("articleStatusFailed"))}</dd></div>
        </dl>
        ${item.error ? `<div class="article-error">${escapeHtml(item.error)}</div>` : ""}
      `;
      articles.appendChild(card);
    });
  }

  function updateStats(metadata, model) {
    statArticles.textContent = metadata.article_count ?? 0;
    statSuccess.textContent = metadata.success_count ?? 0;
    statFailed.textContent = metadata.failed_count ?? 0;
    statNodes.textContent = metadata.node_count ?? 0;
    statLinks.textContent = metadata.link_count ?? 0;
    statModel.textContent = model || metadata.model || "mock";
  }

  function resetDashboard() {
    updateStats({ article_count: 0, success_count: 0, failed_count: 0, node_count: 0, link_count: 0 }, modelSelector.value || "mock");
    window.__lastArticles = [];
    window.__lastGraphData = { nodes: [], links: [], metadata: {} };
    window.__lastResult = null;
    articles.innerHTML = `<div class="article-card muted">${escapeHtml(t("articlesEmpty"))}</div>`;
    summary.textContent = t("summaryEmpty");
    clearError();
  }

  function loadExample() {
    urlInput.value = "";
    manualText.value = [
      "WebMind Graph helps readers compare multiple articles and turn dense text into a lightweight knowledge graph.",
      "The demo can extract concepts, keywords, entities, and relationships from pasted content.",
      "Cloudflare Pages Functions make the project easy to deploy without a traditional server.",
      "DeepSeek can be enabled with an environment variable, while mock mode keeps the demo usable without an API key.",
      "这个示例展示了中英文混合文本也可以生成基础图谱。"
    ].join(" ");
    saveDraft();
    clearError();
    setStatus(t("sampleLoaded"), "success");
  }

  async function copySummary() {
    const text = buildReportText();
    if (!text.trim()) {
      showError(t("noSummary"));
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setStatus(t("copied"), "success");
    } catch {
      showError(t("copyFailed"));
    }
  }

  function exportJson() {
    if (!window.__lastResult) {
      setStatus(t("exportEmpty"), "warning");
    }
    const data = {
      input: buildPayload(),
      result: window.__lastResult || null,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `webmind-graph-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    if (window.__lastResult) setStatus(t("exported"), "success");
  }

  function clearLocalData() {
    safeStorageRemove(STORAGE_KEY);
    urlInput.value = "";
    manualText.value = "";
    resetDashboard();
    window.renderGraph?.({ nodes: [], links: [], metadata: {} });
    setStatus(t("cleared"), "success");
  }

  function saveDraft() {
    safeStorageSet(STORAGE_KEY, {
      urls: urlInput.value,
      manual_text: manualText.value,
      model: modelSelector.value || "mock",
      result: window.__lastResult || null,
      saved_at: new Date().toISOString(),
    });
  }

  function restoreState() {
    const state = safeStorageGet(STORAGE_KEY);
    if (!state || typeof state !== "object") return false;

    urlInput.value = typeof state.urls === "string" ? state.urls : "";
    manualText.value = typeof state.manual_text === "string" ? state.manual_text : "";
    if (state.model && modelSelector.querySelector(`option[value="${cssEscape(state.model)}"]:not(:disabled)`)) {
      modelSelector.value = state.model;
    }
    if (!state.result || typeof state.result !== "object") {
      resetDashboard();
      window.renderGraph?.({ nodes: [], links: [], metadata: {} });
      return Boolean(urlInput.value || manualText.value);
    }

    window.__lastResult = state.result;
    window.__lastArticles = Array.isArray(state.result.articles) ? state.result.articles : [];
    window.__lastGraphData = state.result.graph || { nodes: [], links: [], metadata: {} };
    summary.textContent = state.result.summary || t("summaryEmpty");
    renderArticles(window.__lastArticles);
    updateStats(state.result.metadata || {}, state.result.model || modelSelector.value || "mock");
    window.renderGraph?.(window.__lastGraphData);
    setStatus(t("ready"), "");
    return true;
  }

  function buildReportText() {
    const result = window.__lastResult;
    if (!result) return summary.textContent || "";
    const meta = result.metadata || {};
    return [
      "WebMind Graph",
      "",
      result.summary || "",
      "",
      `Model: ${result.model || meta.model || "mock"}`,
      `Articles: ${meta.article_count ?? 0}`,
      `Success: ${meta.success_count ?? 0}`,
      `Failed: ${meta.failed_count ?? 0}`,
      `Nodes: ${meta.node_count ?? 0}`,
      `Links: ${meta.link_count ?? 0}`,
    ].join("\n");
  }

  function safeStorageGet(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      safeStorageRemove(key);
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be disabled or full; keep the app usable.
    }
  }

  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage failures.
    }
  }

  function parseUrls(value) {
    const valid = [];
    const invalid = [];
    String(value || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        try {
          const url = new URL(line);
          if (url.protocol === "http:" || url.protocol === "https:") valid.push(url.href);
          else invalid.push(line);
        } catch {
          invalid.push(line);
        }
      });
    return { valid, invalid };
  }

  function setBusy(isBusy) {
    busy = isBusy;
    analyzeButton.disabled = isBusy;
    crawlButton.disabled = isBusy;
    sampleButton.disabled = isBusy;
    copyButton.disabled = isBusy;
    exportButton.disabled = isBusy;
    clearButton.disabled = isBusy;
    analyzeButton.textContent = isBusy ? t("analyzeBusy") : t("analyzeButton");
    crawlButton.textContent = t("crawlButton");
  }

  function setStatus(message, kind) {
    status.dataset.kind = kind || "";
    status.textContent = message;
    status.className = `status ${kind || ""}`;
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }

  function applyLanguage() {
    const language = currentLanguage;
    const setText = (id, text) => {
      const element = $(id);
      if (element) element.textContent = text;
    };

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    setText("heroText", t("heroText"));
    setText("stepOne", t("stepOne"));
    setText("stepTwo", t("stepTwo"));
    setText("stepThree", t("stepThree"));
    setText("languageLabel", t("languageLabel"));
    setText("modelLabel", t("modelLabel"));
    modelHelp.textContent = modelSelector.disabled ? t("modelHelpSingle") : t("modelHelpMulti");
    setText("inputTitle", t("inputTitle"));
    setText("urlsLabel", t("urlsLabel"));
    setText("manualTextLabel", t("manualTextLabel"));
    setText("sampleButton", t("sampleButton"));
    setText("copyButton", t("copyButton"));
    setText("exportButton", t("exportButton"));
    setText("clearButton", t("clearButton"));
    setText("summaryTitle", t("summaryTitle"));
    setText("articlesTitle", t("articlesTitle"));
    setText("graphTitle", t("graphTitle"));
    setText("footerNote", t("footerNote"));
    setText("statArticlesLabel", t("statTotal"));
    setText("statSuccessLabel", t("statSuccess"));
    setText("statFailedLabel", t("statFailed"));
    setText("statNodesLabel", t("statNodes"));
    setText("statLinksLabel", t("statLinks"));
    setText("statModelLabel", t("statModel"));
    urlInput.placeholder = t("urlsPlaceholder");
    manualText.placeholder = t("manualTextPlaceholder");
    setBusy(busy);
    if (!status.dataset.kind) setStatus(t("ready"), "");
    safeLanguageSet(currentLanguage);
    window.__webmindLanguage = language;
  }

  function t(key) {
    return (COPY[currentLanguage] && COPY[currentLanguage][key]) || COPY.bilingual[key] || key;
  }

  function detectLanguage() {
    let stored = null;
    try {
      stored = localStorage.getItem(LANGUAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored && COPY[stored]) return stored;
    const browserLanguage = (navigator.language || "").toLowerCase();
    return browserLanguage.startsWith("zh") ? "bilingual" : "en";
  }

  function safeLanguageSet(language) {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Language persistence is optional.
    }
  }

  function getCurrentArticles() {
    return window.__lastArticles || [];
  }

  function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function cssEscape(value) {
    return window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/"/g, '\\"');
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  init().catch((error) => {
    showError(`${t("initFailed")}: ${error.message || error}`);
    setStatus(t("initFailed"), "error");
  });
})();
