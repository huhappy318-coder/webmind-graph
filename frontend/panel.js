(function () {
  const COPY = {
    bilingual: {
      heroText: "对比 URL 或粘贴文本，查看轻量级文章知识图谱。 / Compare URLs or pasted text and inspect a lightweight article knowledge graph.",
      languageLabel: "语言 / Language",
      modelLabel: "模型 / Model",
      modelHelpSingle: "当前线上演示版仅启用模拟模型，其他模型会在接入真实 Provider 后开放。 / Only the mock model is available in the hosted demo right now.",
      modelHelpMulti: "可切换已启用模型，未启用项会标记为即将支持。 / Switch between enabled models. Disabled items are marked as coming soon.",
      comingSoonSuffix: "（即将支持） / (Coming soon)",
      copied: "已复制摘要 / Summary copied",
      copyFailed: "复制失败，请手动选择文本复制。 / Copy failed. Select the text manually.",
      exported: "已导出 JSON / JSON exported",
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
      analyzingSummary: "正在处理内容并构建图谱…… / Working through the provided content and building a graph...",
      analysisComplete: "分析完成 / Analysis complete",
      analysisPartial: "部分结果已返回 / Partial results returned",
      analysisNoGraph: "分析完成，但没有生成图谱 / Analysis finished, but no graph data was created",
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
      analyzeBusy: "分析中… / Analyzing...",
      crawlButton: "抓取测试 / Test Crawl",
      summaryTitle: "运行摘要 / Run Summary",
      summaryEmpty: "还没有分析结果。 / No analysis yet.",
      articlesTitle: "文章列表 / Articles",
      articlesEmpty: "还没有文章详情。 / No article details yet.",
      graphTitle: "知识图谱 / Knowledge Graph",
      needInputError: "请至少输入一个 URL 或一段手动文本后再开始分析。 / Please add at least one URL or some manual text before starting analysis.",
      needUrlError: "请先输入至少一个 URL 再测试抓取。 / Add at least one URL first to test crawling.",
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
      articleStatusFailed: "失败 / failed"
    },
    zh: {
      heroText: "对比 URL 或粘贴文本，查看轻量级文章知识图谱。",
      languageLabel: "语言",
      modelLabel: "模型",
      modelHelpSingle: "当前线上演示版仅启用模拟模型，其他模型会在接入真实 Provider 后开放。",
      modelHelpMulti: "可切换已启用模型，未启用项会标记为即将支持。",
      comingSoonSuffix: "（即将支持）",
      copied: "已复制摘要",
      copyFailed: "复制失败，请手动选择文本复制。",
      exported: "已导出 JSON",
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
      analyzingSummary: "正在处理内容并构建图谱……",
      analysisComplete: "分析完成",
      analysisPartial: "已返回部分结果",
      analysisNoGraph: "分析完成，但没有生成图谱",
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
      analyzeBusy: "分析中…",
      crawlButton: "抓取测试",
      summaryTitle: "运行摘要",
      summaryEmpty: "还没有分析结果。",
      articlesTitle: "文章列表",
      articlesEmpty: "还没有文章详情。",
      graphTitle: "知识图谱",
      needInputError: "请至少输入一个 URL 或一段手动文本后再开始分析。",
      needUrlError: "请先输入至少一个 URL 再测试抓取。",
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
      articleStatusFailed: "失败"
    },
    en: {
      heroText: "Compare URLs or pasted text and inspect a lightweight article knowledge graph.",
      languageLabel: "Language",
      modelLabel: "Model",
      modelHelpSingle: "Only the mock model is enabled in the hosted demo right now. Other models will be unlocked after real provider integration.",
      modelHelpMulti: "Switch between enabled models. Disabled items are marked as coming soon.",
      comingSoonSuffix: "(Coming soon)",
      copied: "Summary copied",
      copyFailed: "Copy failed. Select the text manually.",
      exported: "JSON exported",
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
      analyzingSummary: "Working through the provided content and building a graph...",
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
      manualTextPlaceholder: "Paste article text here when scraping is blocked, the page needs JavaScript rendering, or you want a quick local demo.",
      analyzeButton: "Start Analysis",
      analyzeBusy: "Analyzing...",
      crawlButton: "Test Crawl",
      summaryTitle: "Run Summary",
      summaryEmpty: "No analysis yet.",
      articlesTitle: "Articles",
      articlesEmpty: "No article details yet.",
      graphTitle: "Knowledge Graph",
      needInputError: "Please add at least one URL or some manual text before starting analysis.",
      needUrlError: "Add at least one URL first to test crawling.",
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
      articleStatusFailed: "failed"
    }
  };

  const modelSelector = document.getElementById("modelSelector");
  const modelHelp = document.getElementById("modelHelp");
  const languageSelector = document.getElementById("languageSelector");
  const urlInput = document.getElementById("urlInput");
  const manualText = document.getElementById("manualText");
  const summary = document.getElementById("summary");
  const articles = document.getElementById("articles");
  const status = document.getElementById("status");
  const errorBox = document.getElementById("errorBox");
  const analyzeButton = document.getElementById("analyzeButton");
  const crawlButton = document.getElementById("crawlButton");
  const sampleButton = document.getElementById("sampleButton");
  const copyButton = document.getElementById("copyButton");
  const exportButton = document.getElementById("exportButton");
  const clearButton = document.getElementById("clearButton");
  const statArticles = document.getElementById("statArticles");
  const statSuccess = document.getElementById("statSuccess");
  const statFailed = document.getElementById("statFailed");
  const statNodes = document.getElementById("statNodes");
  const statLinks = document.getElementById("statLinks");
  const statModel = document.getElementById("statModel");
  const STORAGE_KEY = "webmind-graph-state-v1";
  let currentLanguage = detectLanguage();

  async function init() {
    languageSelector.value = currentLanguage;
    applyLanguage();
    await loadModels();
    bindEvents();
    if (!restoreState()) {
      resetDashboard();
      window.renderGraph({ nodes: [], links: [], metadata: {} });
    }
  }

  async function loadModels() {
    let data;
    try {
      const response = await fetch("/api/available-models");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
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
    const models = data.models || [];
    modelSelector.innerHTML = "";
    models.forEach(model => {
      const option = document.createElement("option");
      option.value = model.name;
      option.textContent = model.available_for_use
        ? model.display_name
        : `${model.display_name} ${t("comingSoonSuffix")}`.trim();
      option.disabled = !model.available_for_use;
      option.selected = model.default;
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
    urlInput.addEventListener("input", saveDraft);
    manualText.addEventListener("input", saveDraft);
    modelSelector.addEventListener("change", saveDraft);
    languageSelector.addEventListener("change", () => {
      currentLanguage = languageSelector.value || "bilingual";
      applyLanguage();
      renderArticles(getCurrentArticles());
      window.renderGraph(window.__lastGraphData || { nodes: [], links: [], metadata: {} });
      saveDraft();
    });
  }

  async function analyze() {
    const payload = buildPayload();
    clearError();
    if (!payload.urls.length && !payload.manual_text.trim()) {
      showError(t("needInputError"));
      setStatus(t("waitingInput"), "warning");
      return;
    }

    setBusy(true);
    setStatus(t("analyzing"), "loading");
    summary.textContent = t("analyzingSummary");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || t("analyzeRequestFailed"));
      }
      window.__lastGraphData = data.graph || { nodes: [], links: [], metadata: {} };
      window.__lastArticles = data.articles || [];
      window.__lastResult = data;
      summary.textContent = data.summary || t("noSummaryReturned");
      renderArticles(data.articles || []);
      updateStats(data.metadata || {}, data.model || "mock");
      window.renderGraph(data.graph);
      if (!data.graph || !data.graph.nodes || !data.graph.nodes.length) {
        setStatus(t("analysisNoGraph"), "warning");
      } else {
        setStatus(data.success ? t("analysisComplete") : t("analysisPartial"), data.success ? "success" : "warning");
      }
      saveDraft();
    } catch (error) {
      resetDashboard();
      renderArticles([]);
      window.renderGraph({ nodes: [], links: [], metadata: {} });
      summary.textContent = t("noSummary");
      showError(error.message || String(error));
      setStatus(t("analysisFailed"), "error");
    } finally {
      setBusy(false);
    }
  }

  async function crawlFirstUrl() {
    const urls = parseUrls(urlInput.value);
    clearError();
    if (!urls.length) {
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
        body: JSON.stringify({ url: urls[0] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || t("crawlRequestFailed"));
      }
      window.__lastArticles = [data];
      window.__lastGraphData = { nodes: [], links: [], metadata: {} };
      window.__lastResult = {
        success: data.success,
        model: modelSelector.value || "mock",
        articles: [data],
        graph: window.__lastGraphData,
        summary: data.summary || "",
        metadata: {
          article_count: 1,
          success_count: data.success ? 1 : 0,
          failed_count: data.success ? 0 : 1,
          node_count: 0,
          link_count: 0,
          model: modelSelector.value || "mock"
        }
      };
      summary.textContent = data.summary || t("noSummaryReturned");
      renderArticles(window.__lastArticles);
      updateStats({
        article_count: 1,
        success_count: data.success ? 1 : 0,
        failed_count: data.success ? 0 : 1,
        node_count: 0,
        link_count: 0,
      }, modelSelector.value || "mock");
      window.renderGraph({ nodes: [], links: [], metadata: {} });
      if (!data.success && data.error) {
        showError(data.error);
      }
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
    return {
      urls: parseUrls(urlInput.value),
      manual_text: manualText.value,
      model: modelSelector.value || "mock",
    };
  }

  function renderArticles(items) {
    articles.innerHTML = "";
    if (!items.length) {
      articles.innerHTML = `<div class="article-card muted">${escapeHtml(t("articlesEmpty"))}</div>`;
      return;
    }
    items.forEach(item => {
      const card = document.createElement("article");
      card.className = `article-card ${item.success ? "" : "article-card-failed"}`.trim();
      const sourceType = item.source_type === "manual" ? t("sourceManual") : t("sourceUrl");
      card.innerHTML = `
        <h3>${escapeHtml(item.title || t("articleUntitled"))}</h3>
        <p>${escapeHtml(item.summary || "")}</p>
        <dl>
          <div><dt>${escapeHtml(t("sourceLabel"))}</dt><dd>${escapeHtml(sourceType)}</dd></div>
          <div><dt>${escapeHtml(t("lengthLabel"))}</dt><dd>${item.content_length || 0}</dd></div>
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
    updateStats({ article_count: 0, success_count: 0, failed_count: 0, node_count: 0, link_count: 0 }, "mock");
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
      "Cloudflare Workers and Pages Functions make the project easy to deploy without a traditional server.",
      "DeepSeek can be enabled with an environment variable, while mock mode keeps the demo usable without an API key."
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
    const data = {
      input: buildPayload(),
      result: window.__lastResult || null,
      exported_at: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `webmind-graph-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus(t("exported"), "success");
  }

  function clearLocalData() {
    safeStorageRemove(STORAGE_KEY);
    urlInput.value = "";
    manualText.value = "";
    resetDashboard();
    window.renderGraph({ nodes: [], links: [], metadata: {} });
    setStatus(t("cleared"), "success");
  }

  function saveDraft() {
    safeStorageSet(STORAGE_KEY, {
      urls: urlInput.value,
      manual_text: manualText.value,
      model: modelSelector.value || "mock",
      result: window.__lastResult || null,
      saved_at: new Date().toISOString()
    });
  }

  function restoreState() {
    const state = safeStorageGet(STORAGE_KEY);
    if (!state) {
      return false;
    }
    urlInput.value = state.urls || "";
    manualText.value = state.manual_text || "";
    if (state.model && modelSelector.querySelector(`option[value="${state.model}"]:not(:disabled)`)) {
      modelSelector.value = state.model;
    }
    if (!state.result) {
      resetDashboard();
      window.renderGraph?.({ nodes: [], links: [], metadata: {} });
      return Boolean(urlInput.value || manualText.value);
    }
    window.__lastResult = state.result;
    window.__lastArticles = state.result.articles || [];
    window.__lastGraphData = state.result.graph || { nodes: [], links: [], metadata: {} };
    summary.textContent = state.result.summary || t("summaryEmpty");
    renderArticles(window.__lastArticles);
    updateStats(state.result.metadata || {}, state.result.model || modelSelector.value || "mock");
    window.renderGraph(window.__lastGraphData);
    setStatus(t("ready"), "");
    return true;
  }

  function buildReportText() {
    const result = window.__lastResult;
    if (!result) {
      return summary.textContent || "";
    }
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
      `Links: ${meta.link_count ?? 0}`
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
    return value
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
  }

  function setBusy(isBusy) {
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
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    };

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    setText("heroText", t("heroText"));
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
    setText("statArticlesLabel", language === "zh" ? "总数" : language === "en" ? "Total" : "总数 / Total");
    setText("statSuccessLabel", language === "zh" ? "成功" : language === "en" ? "Success" : "成功 / Success");
    setText("statFailedLabel", language === "zh" ? "失败" : language === "en" ? "Failed" : "失败 / Failed");
    setText("statNodesLabel", language === "zh" ? "节点" : language === "en" ? "Nodes" : "节点 / Nodes");
    setText("statLinksLabel", language === "zh" ? "连线" : language === "en" ? "Links" : "连线 / Links");
    setText("statModelLabel", language === "zh" ? "模型" : language === "en" ? "Model" : "模型 / Model");
    urlInput.placeholder = t("urlsPlaceholder");
    manualText.placeholder = t("manualTextPlaceholder");
    setBusy(false);
    if (!status.dataset.kind) setStatus(t("ready"), "");
    else if (status.dataset.kind === "loading") setStatus(t("analyzing"), "loading");
    else if (status.dataset.kind === "success" && summary.textContent === t("noSummary")) setStatus(t("analysisComplete"), "success");
    try {
      localStorage.setItem("webmind-language", currentLanguage);
    } catch {
      // Language persistence is optional; keep the page usable when storage is blocked.
    }
    window.__webmindLanguage = language;
  }

  function t(key) {
    return (COPY[currentLanguage] && COPY[currentLanguage][key]) || COPY.bilingual[key] || key;
  }

  function detectLanguage() {
    let stored = null;
    try {
      stored = localStorage.getItem("webmind-language");
    } catch {
      stored = null;
    }
    if (stored && COPY[stored]) {
      return stored;
    }
    const browserLanguage = (navigator.language || "").toLowerCase();
    return browserLanguage.startsWith("zh") ? "bilingual" : "en";
  }

  function getCurrentArticles() {
    return window.__lastArticles || [];
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  init().catch(error => {
    showError(`${t("initFailed")}: ${error.message || error}`);
    setStatus(t("initFailed"), "error");
  });
})();
