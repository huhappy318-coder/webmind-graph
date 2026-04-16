from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_analyze_without_input_returns_400():
    response = client.post("/api/analyze", json={"urls": [], "manual_text": "", "model": "mock"})
    assert response.status_code == 400
    assert "at least one URL" in response.json()["detail"]
