(function () {
  const COPY = {
    bilingual: {
      heroText: "对比 URL 或粘贴文本，查看轻量级文章知识图谱。 / Compare URLs or pasted text and inspect a lightweight article knowledge graph.",
      languageLabel: "语言 / Language",
      modelLabel: "模型 / Model",
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
  const languageSelector = document.getElementById("languageSelector");
  const urlInput = document.getElementById("urlInput");
  const manualText = document.getElementById("manualText");
  const summary = document.getElementById("summary");
  const articles = document.getElementById("articles");
  const status = document.getElementById("status");
  const errorBox = document.getElementById("errorBox");
  const analyzeButton = document.getElementById("analyzeButton");
  const crawlButton = document.getElementById("crawlButton");
  const statArticles = document.getElementById("statArticles");
  const statSuccess = document.getElementById("statSuccess");
  const statFailed = document.getElementById("statFailed");
  const statNodes = document.getElementById("statNodes");
  const statLinks = document.getElementById("statLinks");
  const statModel = document.getElementById("statModel");
  let currentLanguage = detectLanguage();

  async function init() {
    languageSelector.value = currentLanguage;
    applyLanguage();
    await loadModels();
    bindEvents();
    resetDashboard();
    window.renderGraph({ nodes: [], links: [], metadata: {} });
  }

  async function loadModels() {
    const response = await fetch("/api/available-models");
    const data = await response.json();
    modelSelector.innerHTML = "";
    (data.models || []).forEach(model => {
      const option = document.createElement("option");
      option.value = model.name;
      option.textContent = model.display_name;
      option.disabled = !model.available_for_use;
      option.selected = model.default;
      modelSelector.appendChild(option);
    });
    modelSelector.value = "mock";
  }

  function bindEvents() {
    analyzeButton.addEventListener("click", analyze);
    crawlButton.addEventListener("click", crawlFirstUrl);
    languageSelector.addEventListener("change", () => {
      currentLanguage = languageSelector.value || "bilingual";
      applyLanguage();
      renderArticles(getCurrentArticles());
      window.renderGraph(window.__lastGraphData || { nodes: [], links: [], metadata: {} });
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
      summary.textContent = data.summary || t("noSummaryReturned");
      renderArticles(data.articles || []);
      updateStats(data.metadata || {}, data.model || "mock");
      window.renderGraph(data.graph);
      if (!data.graph || !data.graph.nodes || !data.graph.nodes.length) {
        setStatus(t("analysisNoGraph"), "warning");
      } else {
        setStatus(data.success ? t("analysisComplete") : t("analysisPartial"), data.success ? "success" : "warning");
      }
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
    articles.innerHTML = `<div class="article-card muted">${escapeHtml(t("articlesEmpty"))}</div>`;
    summary.textContent = t("summaryEmpty");
    clearError();
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
    setText("inputTitle", t("inputTitle"));
    setText("urlsLabel", t("urlsLabel"));
    setText("manualTextLabel", t("manualTextLabel"));
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
    localStorage.setItem("webmind-language", currentLanguage);
    window.__webmindLanguage = language;
  }

  function t(key) {
    return (COPY[currentLanguage] && COPY[currentLanguage][key]) || COPY.bilingual[key] || key;
  }

  function detectLanguage() {
    const stored = localStorage.getItem("webmind-language");
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
