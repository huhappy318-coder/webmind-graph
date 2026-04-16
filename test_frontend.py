from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_frontend_contains_core_elements():
    response = client.get("/")
    html = response.text
    assert response.status_code == 200
    assert 'id="modelSelector"' in html
    assert 'id="urlInput"' in html
    assert 'id="manualText"' in html
    assert 'id="analyzeButton"' in html
    assert 'id="graphContainer"' in html
    assert 'id="errorBox"' in html
    assert 'id="statModel"' in html
