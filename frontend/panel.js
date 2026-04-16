(function () {
  const modelSelector = document.getElementById("modelSelector");
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

  async function init() {
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
  }

  async function analyze() {
    const payload = buildPayload();
    clearError();
    if (!payload.urls.length && !payload.manual_text.trim()) {
      showError("Please add at least one URL or some manual text before starting analysis.");
      setStatus("Waiting for input", "warning");
      return;
    }

    setBusy(true);
    setStatus("Analyzing sources...", "loading");
    summary.textContent = "Working through the provided content and building a graph...";

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Analyze request failed");
      }
      summary.textContent = data.summary || "No summary returned.";
      renderArticles(data.articles || []);
      updateStats(data.metadata || {}, data.model || "mock");
      window.renderGraph(data.graph);
      if (!data.graph || !data.graph.nodes || !data.graph.nodes.length) {
        setStatus("Analysis finished, but no graph data was created", "warning");
      } else {
        setStatus(data.success ? "Analysis complete" : "Analysis returned partial results", data.success ? "success" : "warning");
      }
    } catch (error) {
      resetDashboard();
      renderArticles([]);
      window.renderGraph({ nodes: [], links: [], metadata: {} });
      summary.textContent = "No summary available.";
      showError(error.message || String(error));
      setStatus("Analysis failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function crawlFirstUrl() {
    const urls = parseUrls(urlInput.value);
    clearError();
    if (!urls.length) {
      showError("Add at least one URL first to test crawling.");
      setStatus("Waiting for URL", "warning");
      return;
    }

    setBusy(true);
    setStatus("Testing crawl...", "loading");
    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urls[0] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Crawl failed");
      }
      summary.textContent = data.summary || "No summary returned.";
      renderArticles([data]);
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
      setStatus(data.success ? "Crawl succeeded" : "Crawl returned fallback guidance", data.success ? "success" : "warning");
    } catch (error) {
      showError(`Crawl failed: ${error.message || error}`);
      setStatus("Crawl failed", "error");
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
      articles.innerHTML = '<div class="article-card muted">No article details yet.</div>';
      return;
    }
    items.forEach(item => {
      const card = document.createElement("article");
      card.className = `article-card ${item.success ? "" : "article-card-failed"}`.trim();
      card.innerHTML = `
        <h3>${escapeHtml(item.title || "Untitled")}</h3>
        <p>${escapeHtml(item.summary || "")}</p>
        <dl>
          <div><dt>Source</dt><dd>${escapeHtml(item.source_type || "url")}</dd></div>
          <div><dt>Length</dt><dd>${item.content_length || 0}</dd></div>
          <div><dt>Status</dt><dd>${item.success ? "ok" : "failed"}</dd></div>
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
    articles.innerHTML = '<div class="article-card muted">No article details yet.</div>';
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
    analyzeButton.textContent = isBusy ? "Analyzing..." : "Start Analysis";
  }

  function setStatus(message, kind) {
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

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  init().catch(error => {
    showError(`Init failed: ${error.message || error}`);
    setStatus("Init failed", "error");
  });
})();
