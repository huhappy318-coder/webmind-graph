(function () {
  const LEGEND_ITEMS = [
    { type: "article", label: "Article" },
    { type: "concept", label: "Concept" },
    { type: "keyword", label: "Keyword" },
    { type: "entity", label: "Entity" }
  ];

  function renderGraph(graphData) {
    const container = document.getElementById("graphContainer");
    const meta = document.getElementById("graphMeta");
    const legend = document.getElementById("graphLegend");
    container.innerHTML = "";
    renderLegend(legend);

    if (!graphData || !Array.isArray(graphData.nodes) || graphData.nodes.length === 0) {
      container.innerHTML = '<div class="empty-state">No graph data yet. Add URLs or text, then start analysis.</div>';
      meta.textContent = "0 nodes, 0 links";
      return;
    }

    const width = container.clientWidth || 720;
    const height = Math.max(container.clientHeight || 640, 420);
    meta.textContent = `${graphData.metadata?.article_count || 0} article(s), ${graphData.nodes.length} node(s), ${graphData.links.length} link(s)`;

    const tooltip = d3.select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const svg = d3.select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Knowledge graph");

    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(d => d.relation === "mentions" ? 85 : 120))
      .force("charge", d3.forceManyBody().strength(-260))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => nodeRadius(d) + 14));

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("class", d => `link link-${safeClass(d.relation)}`)
      .attr("stroke-width", d => Math.max(1, Math.min(4, d.weight || 1)));

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("class", d => `node node-${safeClass(d.type)}`)
      .attr("r", d => nodeRadius(d))
      .call(drag(simulation));

    const labelData = graphData.nodes.filter((nodeData, index) => index < 18 || nodeData.type === "article");
    const label = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(labelData)
      .join("text")
      .text(d => d.label)
      .attr("class", "node-label")
      .attr("dy", 4);

    node
      .on("mouseover", function (event, d) {
        d3.select(this).classed("hovered", true);
        tooltip.style("opacity", 1)
          .html(
            `<strong>${escapeHtml(d.label)}</strong><br>` +
            `type: ${escapeHtml(d.type)}<br>` +
            `sources: ${(d.sources || []).length}`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.offsetX + 14}px`)
          .style("top", `${event.offsetY + 14}px`);
      })
      .on("mouseout", function () {
        d3.select(this).classed("hovered", false);
        tooltip.style("opacity", 0);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => clamp(d.source.x, 18, width - 18))
        .attr("y1", d => clamp(d.source.y, 18, height - 18))
        .attr("x2", d => clamp(d.target.x, 18, width - 18))
        .attr("y2", d => clamp(d.target.y, 18, height - 18));

      node
        .attr("cx", d => d.x = clamp(d.x, 20, width - 20))
        .attr("cy", d => d.y = clamp(d.y, 20, height - 20));

      label
        .attr("x", d => d.x + nodeRadius(d) + 6)
        .attr("y", d => d.y);
    });
  }

  function renderLegend(legend) {
    legend.innerHTML = LEGEND_ITEMS
      .map(item => `<span class="legend-item"><i class="legend-dot node-${safeClass(item.type)}"></i>${item.label}</span>`)
      .join("");
  }

  function nodeRadius(node) {
    return Math.max(8, Math.min(20, 8 + (node.weight || 1) * 1.6));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value || min));
  }

  function safeClass(value) {
    return String(value || "unknown").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function drag(simulation) {
    function dragStarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  }

  window.renderGraph = renderGraph;
})();
