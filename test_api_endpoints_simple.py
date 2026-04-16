from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_root_serves_frontend():
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "WebMind Graph" in response.text


def test_static_assets_are_served():
    css = client.get("/static/style.css")
    js = client.get("/static/panel.js")
    assert css.status_code == 200
    assert js.status_code == 200


def test_crawl_rejects_invalid_url_schema():
    response = client.post("/api/crawl", json={"url": "notaurl"})
    assert response.status_code == 422
