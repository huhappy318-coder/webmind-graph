from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .ai_extractor import AIExtractor
from .graph_builder import GraphBuilder
from .models import AnalyzeRequest, AnalyzeResponse, ArticleContent, CrawlRequest
from .scraper import fetch_and_extract_content


APP_VERSION = "0.2.0"
ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT_DIR / "frontend"

app = FastAPI(title="WebMind Graph", version=APP_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


@app.get("/")
async def index():
    index_path = FRONTEND_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return {"ok": True, "app": "webmind-graph", "version": APP_VERSION}


@app.get("/api/health")
async def health():
    return {"ok": True, "app": "webmind-graph", "version": APP_VERSION}


@app.get("/api/available-models")
async def available_models():
    return {"models": AIExtractor.available_models()}


@app.get("/api/active-model")
async def active_model():
    active, _ = AIExtractor.resolve_model(os.getenv("ACTIVE_MODEL", "mock"))
    info = AIExtractor.PROVIDERS[active]
    return {"active_model": active, "display_name": info["display_name"]}


@app.post("/api/crawl")
async def crawl(request: CrawlRequest):
    article = await fetch_and_extract_content(str(request.url))
    return article.model_dump()


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    urls = [url.strip() for url in request.urls if url.strip()]
    manual_text = request.manual_text.strip()
    if not urls and not manual_text:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least one URL or some manual text to analyze.",
        )

    articles: list[ArticleContent] = []
    for url in urls:
        article = await fetch_and_extract_content(url)
        articles.append(article)

    if manual_text:
        articles.append(
            ArticleContent(
                title="Manual Text",
                url="manual://input",
                content=manual_text,
                summary=manual_text[:420],
                success=True,
                error=None,
                content_length=len(manual_text),
                source_type="manual",
            )
        )

    extractor = AIExtractor(request.model or "mock")
    requested_model = extractor.requested_provider
    builder = GraphBuilder(model_name=extractor.provider_name)
    success_count = 0
    summaries: list[str] = []

    for index, article in enumerate(articles, start=1):
        if not article.success or not article.content:
            continue
        source_id = article.url if article.source_type == "url" else f"manual-{index}"
        extracted = await extractor.extract_knowledge_graph(
            article.content,
            title=article.title,
            source_id=source_id,
        )
        builder.merge_graph_data(extracted["graph"], article_id=source_id)
        success_count += 1
        if extracted.get("summary"):
            summaries.append(f"{article.title}: {extracted['summary']}")

    graph = builder.export_graph()
    graph_metadata = graph["metadata"]
    failed_count = len(articles) - success_count
    success = success_count > 0

    if success:
        summary = (
            f"Processed {len(articles)} source(s): {success_count} succeeded, "
            f"{failed_count} failed. Built a graph with {graph_metadata['node_count']} nodes "
            f"and {graph_metadata['link_count']} links."
        )
        if summaries:
            summary = f"{summary} Highlights: {' '.join(summaries[:2])}"
    else:
        summary = (
            "No readable sources were analyzed successfully. "
            "Try another URL or paste text directly for a guaranteed demo path."
        )

    return AnalyzeResponse(
        success=success,
        model=extractor.provider_name,
        articles=articles,
        graph=graph,
        summary=summary[:1200],
        metadata={
            "requested_model": requested_model,
            "model": extractor.provider_name,
            "article_count": len(articles),
            "success_count": success_count,
            "failed_count": failed_count,
            "node_count": graph_metadata["node_count"],
            "link_count": graph_metadata["link_count"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "manual_text_used": bool(manual_text),
            "url_count": len(urls),
        },
    )
