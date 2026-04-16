import asyncio

from backend.ai_extractor import AIExtractor


def test_mock_model_extraction():
    extractor = AIExtractor("mock")
    result = asyncio.run(
        extractor.extract_knowledge_graph(
            "FastAPI and D3 help visualize structured article relationships.",
            title="Demo Article",
            source_id="article-1",
        )
    )
    assert result["title"] == "Demo Article"
    assert result["graph"]["nodes"]
    assert any(node["type"] == "article" for node in result["graph"]["nodes"])


def test_mock_provider_always_available():
    assert AIExtractor.is_provider_configured("mock") is True
