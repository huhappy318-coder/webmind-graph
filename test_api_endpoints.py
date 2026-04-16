from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_available_models_endpoint():
    response = client.get("/api/available-models")
    assert response.status_code == 200
    data = response.json()
    names = [item["display_name"] for item in data["models"]]
    assert "Anthropic Claude" in names
    assert "OpenAI GPT-4o" in names
    assert "Google Gemini" in names
    assert "DeepSeek" in names
    assert any(name.startswith("Qwen/") for name in names)
    assert any(name.startswith("Kimi/") for name in names)
    assert "Mock Model" in names


def test_active_model_endpoint(monkeypatch):
    monkeypatch.setenv("ACTIVE_MODEL", "mock")
    response = client.get("/api/active-model")
    assert response.status_code == 200
    assert response.json()["active_model"] == "mock"


def test_analyze_manual_text_endpoint():
    payload = {
        "urls": [],
        "manual_text": "Python powers async web services and knowledge graph tools.",
        "model": "mock",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["metadata"]["article_count"] == 1
    assert data["metadata"]["success_count"] == 1
    assert data["metadata"]["failed_count"] == 0
    assert data["metadata"]["node_count"] >= 2
    assert any(node["type"] == "article" for node in data["graph"]["nodes"])


def test_analyze_partial_success_with_url_and_manual_text():
    payload = {
        "urls": ["not-a-real-url"],
        "manual_text": "Manual fallback content about AI governance and model evaluation.",
        "model": "mock",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["metadata"]["article_count"] == 2
    assert data["metadata"]["success_count"] == 1
    assert data["metadata"]["failed_count"] == 1
