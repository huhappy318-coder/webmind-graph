from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, HttpUrl


class CrawlRequest(BaseModel):
    url: HttpUrl


class AnalyzeRequest(BaseModel):
    urls: list[str] = Field(default_factory=list)
    manual_text: str = ""
    model: str = "mock"


class ArticleContent(BaseModel):
    title: str = "Untitled"
    url: str = ""
    content: str = ""
    summary: str = ""
    success: bool = True
    error: str | None = None
    content_length: int = 0
    source_type: str = "url"


class GraphNode(BaseModel):
    id: str
    label: str
    type: str = "concept"
    weight: float = 1.0
    sources: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class GraphLink(BaseModel):
    source: str
    target: str
    relation: str = "related_to"
    weight: float = 1.0
    sources: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class GraphData(BaseModel):
    nodes: list[GraphNode] = Field(default_factory=list)
    links: list[GraphLink] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AnalyzeResponse(BaseModel):
    success: bool
    model: str
    articles: list[ArticleContent] = Field(default_factory=list)
    graph: GraphData
    summary: str = ""
    metadata: dict[str, Any] = Field(default_factory=dict)

