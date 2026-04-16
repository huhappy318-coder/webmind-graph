from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any

from .models import GraphData, GraphLink, GraphNode


class GraphBuilder:
    def __init__(self, model_name: str = "mock"):
        self.model_name = model_name
        self.nodes: dict[str, GraphNode] = {}
        self.links: dict[tuple[str, str, str], GraphLink] = {}
        self.article_ids: set[str] = set()
        self.node_aliases: dict[str, str] = {}

    def merge_graph_data(self, graph_data: dict[str, Any], article_id: str = "") -> None:
        normalized_id_map: dict[str, str] = {}
        graph_metadata = graph_data.get("metadata", {})

        for raw_node in graph_data.get("nodes", []):
            node = self._node_from_dict(raw_node)
            canonical = self._canonical_node_id(node)
            normalized_id_map[node.id] = canonical
            normalized_id_map[node.label] = canonical
            self.node_aliases[node.id] = canonical
            self.node_aliases[node.label] = canonical

            if node.type == "article":
                self.article_ids.add(canonical)

            normalized_sources = self._merge_sources(node.sources, [article_id] if article_id else [])
            if canonical in self.nodes:
                existing = self.nodes[canonical]
                existing.weight = max(existing.weight, node.weight)
                existing.sources = self._merge_sources(existing.sources, normalized_sources)
                existing.metadata.update(node.metadata)
                if len(node.label) > len(existing.label):
                    existing.label = node.label
            else:
                node.id = canonical
                node.sources = normalized_sources
                node.metadata.setdefault("original_id", raw_node.get("id", node.id))
                node.metadata.setdefault("provider", graph_metadata.get("provider", "mock"))
                self.nodes[canonical] = node

        for raw_link in graph_data.get("links", graph_data.get("edges", [])):
            link = self._link_from_dict(raw_link)
            source = normalized_id_map.get(link.source) or self.node_aliases.get(link.source) or self._canonical_text_id(link.source)
            target = normalized_id_map.get(link.target) or self.node_aliases.get(link.target) or self._canonical_text_id(link.target)
            if source == target:
                continue
            source, target = self._normalize_link_direction(source, target, link.relation)
            key = (source, target, link.relation)
            if key in self.links:
                existing = self.links[key]
                existing.weight = max(existing.weight, link.weight)
                existing.sources = self._merge_sources(existing.sources, link.sources, [article_id] if article_id else [])
                existing.metadata.update(link.metadata)
            else:
                link.source = source
                link.target = target
                link.sources = self._merge_sources(link.sources, [article_id] if article_id else [])
                self.links[key] = link

        self._add_cooccurrence_edges(article_id)

    def export_graph(self) -> dict[str, Any]:
        graph = GraphData(
            nodes=sorted(self.nodes.values(), key=lambda node: (node.type != "article", -node.weight, node.label.lower())),
            links=sorted(self.links.values(), key=lambda link: (link.relation, link.source, link.target)),
            metadata={
                "model": self.model_name,
                "article_count": len(self.article_ids),
                "node_count": len(self.nodes),
                "link_count": len(self.links),
                "generated_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        return graph.model_dump()

    def _add_cooccurrence_edges(self, article_id: str) -> None:
        if not article_id:
            return
        concept_nodes = [
            node for node in self.nodes.values()
            if article_id in node.sources and node.type in {"concept", "entity"}
        ]
        concept_nodes = sorted(concept_nodes, key=lambda node: (-node.weight, node.label.lower()))[:5]
        for left_index, left in enumerate(concept_nodes):
            for right in concept_nodes[left_index + 1:left_index + 3]:
                source, target = self._normalize_link_direction(left.id, right.id, "co_occurs_with")
                key = (source, target, "co_occurs_with")
                if key in self.links:
                    self.links[key].sources = self._merge_sources(self.links[key].sources, [article_id])
                    continue
                self.links[key] = GraphLink(
                    source=source,
                    target=target,
                    relation="co_occurs_with",
                    weight=0.8,
                    sources=[article_id],
                    metadata={"derived": True},
                )

    def _node_from_dict(self, data: dict[str, Any]) -> GraphNode:
        return GraphNode(
            id=str(data.get("id") or data.get("label") or "node"),
            label=str(data.get("label") or data.get("id") or "Node"),
            type=str(data.get("type") or "concept"),
            weight=float(data.get("weight") or 1.0),
            sources=list(data.get("sources") or data.get("articles") or []),
            metadata=dict(data.get("metadata") or {}),
        )

    def _link_from_dict(self, data: dict[str, Any]) -> GraphLink:
        return GraphLink(
            source=str(data.get("source")),
            target=str(data.get("target")),
            relation=str(data.get("relation") or data.get("type") or "related_to"),
            weight=float(data.get("weight") or 1.0),
            sources=list(data.get("sources") or data.get("articles") or []),
            metadata=dict(data.get("metadata") or {}),
        )

    def _canonical_node_id(self, node: GraphNode) -> str:
        prefix = "article" if node.type == "article" else node.type
        basis = node.id if node.type == "article" else node.label or node.id
        return self._canonical_text_id(basis, prefix=prefix)

    def _canonical_text_id(self, value: str, prefix: str = "concept") -> str:
        text = str(value).lower().strip()
        text = re.sub(r"^(article|concept|keyword|theme|entity)-", "", text)
        text = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", text).strip("-")
        return f"{prefix}-{text[:64] or 'item'}"

    def _merge_sources(self, *source_lists: list[str]) -> list[str]:
        merged: list[str] = []
        seen = set()
        for source_list in source_lists:
            for source in source_list:
                if not source or source in seen:
                    continue
                seen.add(source)
                merged.append(source)
        return merged

    def _normalize_link_direction(self, source: str, target: str, relation: str) -> tuple[str, str]:
        if relation in {"related_to", "co_occurs_with"} and source > target:
            return target, source
        return source, target


def create_mock_graph_data(
    article_id: str = "article-1",
    title: str = "Mock Article",
    entities: list[dict[str, Any]] | None = None,
    relations: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    entities = entities or [
        {"name": "Knowledge Graph", "type": "concept", "weight": 3},
        {"name": "Article Analysis", "type": "keyword", "weight": 2},
    ]
    relations = relations or [
        {"source": "Knowledge Graph", "target": "Article Analysis", "relation": "related_to"},
    ]
    article_node_id = f"article-{article_id}"
    nodes = [
        {
            "id": article_node_id,
            "label": title,
            "type": "article",
            "weight": 3,
            "sources": [article_id],
        }
    ]
    links = []
    for entity in entities:
        label = entity.get("name", "Concept")
        entity_type = entity.get("type", "concept")
        entity_id = f"{entity_type}-{str(label).lower().replace(' ', '-')}"
        nodes.append(
            {
                "id": entity_id,
                "label": label,
                "type": entity_type,
                "weight": entity.get("weight", 1),
                "sources": [article_id],
            }
        )
        links.append(
            {
                "source": article_node_id,
                "target": entity_id,
                "relation": "mentions",
                "weight": entity.get("weight", 1),
                "sources": [article_id],
            }
        )
    for relation in relations:
        links.append(
            {
                "source": f"concept-{str(relation.get('source', '')).lower().replace(' ', '-')}",
                "target": f"concept-{str(relation.get('target', '')).lower().replace(' ', '-')}",
                "relation": relation.get("relation", "related_to"),
                "weight": relation.get("weight", 1),
                "sources": [article_id],
                "metadata": {"sentiment": relation.get("sentiment", "neutral")},
            }
        )
    return {
        "nodes": nodes,
        "links": links,
        "metadata": {"article_id": article_id, "title": title, "provider": "mock"},
    }
