from __future__ import annotations

import re
from collections import Counter
from typing import Any

from .base import BaseProvider


STOP_WORDS = {
    "the", "and", "for", "that", "this", "with", "from", "are", "was", "were",
    "will", "have", "has", "had", "not", "but", "you", "your", "they", "their",
    "about", "into", "more", "than", "then", "there", "these", "those", "which",
    "when", "what", "where", "who", "how", "can", "could", "would", "should",
    "also", "been", "being", "over", "under", "between", "while", "because",
    "using", "used", "use", "such", "many", "most", "some", "each", "other",
    "after", "before", "through", "across", "within",
}

ENTITY_PATTERNS = [
    re.compile(r"\b([A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9]+){1,2})\b"),
    re.compile(r"\b([A-Z]{2,}(?:\s+[A-Z]{2,})*)\b"),
    re.compile(r"\b([A-Z][a-z]+[A-Z][A-Za-z0-9]*)\b"),
]

TECH_ENTITY_HINTS = {
    "python", "fastapi", "docker", "openai", "anthropic", "claude", "gemini",
    "deepseek", "qwen", "kimi", "javascript", "typescript", "react", "nodejs",
    "api", "apis", "d3",
}


class MockProvider(BaseProvider):
    name = "mock"
    display_name = "Mock Model"

    @classmethod
    def is_configured(cls) -> bool:
        return True

    async def extract(self, text: str, title: str = "", source_id: str = "") -> dict[str, Any]:
        clean_text = re.sub(r"\s+", " ", text or "").strip()
        article_id = self._slug(source_id or title or "manual-article", "article")
        source_ref = source_id or article_id
        keywords = self._keywords(clean_text)
        keyword_labels = [item["keyword"] for item in keywords]
        entities = self._entities(clean_text, keyword_labels)
        summary = self._summary(clean_text)

        nodes: list[dict[str, Any]] = [
            {
                "id": article_id,
                "label": title or "Manual Text",
                "type": "article",
                "weight": 3.0,
                "sources": [source_ref],
                "metadata": {"title": title or "Manual Text", "kind": "article"},
            }
        ]
        links: list[dict[str, Any]] = []
        seen_node_ids = {article_id}

        concept_nodes = []
        keyword_nodes = []

        for index, item in enumerate(keywords[:6], start=1):
            label = item["keyword"]
            node_type = "concept" if index <= 3 else "keyword"
            node_id = self._slug(label, node_type)
            if node_id in seen_node_ids:
                continue
            seen_node_ids.add(node_id)
            weight = min(5.0, 1.1 + item["count"])
            node = {
                "id": node_id,
                "label": label,
                "type": node_type,
                "weight": weight,
                "sources": [source_ref],
                "metadata": {"count": item["count"], "rank": index},
            }
            nodes.append(node)
            if node_type == "concept":
                concept_nodes.append(node)
            else:
                keyword_nodes.append(node)
            links.append(
                {
                    "source": article_id,
                    "target": node_id,
                    "relation": "mentions",
                    "weight": weight,
                    "sources": [source_ref],
                    "metadata": {"rank": index},
                }
            )

        for entity in entities[:2]:
            node_id = self._slug(entity, "entity")
            if node_id in seen_node_ids:
                continue
            seen_node_ids.add(node_id)
            node = {
                "id": node_id,
                "label": entity,
                "type": "entity",
                "weight": 2.4,
                "sources": [source_ref],
                "metadata": {"kind": "named_entity"},
            }
            nodes.append(node)
            concept_nodes.append(node)
            links.append(
                {
                    "source": article_id,
                    "target": node_id,
                    "relation": "mentions",
                    "weight": 1.5,
                    "sources": [source_ref],
                    "metadata": {},
                }
            )

        related_chain = concept_nodes[:3] + keyword_nodes[:2]
        for left, right in zip(related_chain, related_chain[1:]):
            links.append(
                {
                    "source": left["id"],
                    "target": right["id"],
                    "relation": "related_to",
                    "weight": 0.9,
                    "sources": [source_ref],
                    "metadata": {},
                }
            )

        return {
            "article_id": article_id,
            "title": title or "Manual Text",
            "summary": summary,
            "keywords": [item["keyword"] for item in keywords[:6]],
            "graph": {
                "nodes": nodes,
                "links": links,
                "metadata": {
                    "provider": self.name,
                    "keyword_count": len(keywords),
                    "entity_count": len(entities),
                    "content_length": len(clean_text),
                },
            },
        }

    def _keywords(self, text: str) -> list[dict[str, Any]]:
        tokens = re.findall(r"[A-Za-z][A-Za-z0-9_-]{2,}|[\u4e00-\u9fff]{2,}", text.lower())
        filtered = []
        for token in tokens:
            normalized = token.strip("-_")
            if normalized in STOP_WORDS:
                continue
            if len(normalized) < 3 and not re.search(r"[\u4e00-\u9fff]", normalized):
                continue
            if normalized.isdigit():
                continue
            if normalized.endswith("ing") and len(normalized) <= 5:
                continue
            filtered.append(normalized)
        counts = Counter(filtered)
        return [{"keyword": word, "count": count} for word, count in counts.most_common(14)]

    def _entities(self, text: str, keyword_labels: list[str]) -> list[str]:
        keyword_set = {label.lower() for label in keyword_labels}
        entities: list[str] = []
        for pattern in ENTITY_PATTERNS:
            for match in pattern.findall(text):
                candidate = match.strip()
                if not self._is_valid_entity(candidate, keyword_set):
                    continue
                entities.append(candidate)

        seen = set()
        unique_entities = []
        for entity in entities:
            key = entity.lower()
            if key in seen:
                continue
            seen.add(key)
            unique_entities.append(entity)
        return unique_entities

    def _is_valid_entity(self, candidate: str, keyword_set: set[str]) -> bool:
        candidate = candidate.strip()
        if len(candidate) < 3:
            return False

        lowered = candidate.lower()
        if lowered in STOP_WORDS or lowered in keyword_set:
            return False

        parts = candidate.split()
        if len(parts) == 1:
            token = parts[0]
            if lowered not in TECH_ENTITY_HINTS and not token.isupper() and not re.search(r"[a-z][A-Z]", token):
                return False
            if token[0].isupper() and token[1:].islower() and lowered not in TECH_ENTITY_HINTS:
                return False

        if all(part.lower() in STOP_WORDS for part in parts):
            return False

        return True

    def _summary(self, text: str) -> str:
        if not text:
            return "No readable content was available for this source."
        sentences = re.split(r"(?<=[.!?\u3002\uff01\uff1f])\s+", text)
        summary = " ".join(sentence.strip() for sentence in sentences[:3] if sentence.strip())
        return summary[:420] or text[:420]

    def _slug(self, value: str, prefix: str) -> str:
        value = value.lower().strip()
        value = re.sub(r"https?://", "", value)
        value = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", value).strip("-")
        if not value:
            value = "item"
        return f"{prefix}-{value[:64]}"
