from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_analyze_with_manual_text_returns_renderable_graph():
    response = client.post(
        "/api/analyze",
        json={
            "urls": [],
            "manual_text": "Knowledge graphs connect articles, entities, and recurring themes.",
            "model": "mock",
        },
    )
    assert response.status_code == 200
    data = response.json()
    graph = data["graph"]
    assert isinstance(graph["nodes"], list)
    assert isinstance(graph["links"], list)
    assert graph["metadata"]["model"] == "mock"
    assert data["metadata"]["success_count"] == 1
    assert data["metadata"]["failed_count"] == 0
