import asyncio

from backend.scraper import clean_html, fetch_and_extract_content


def test_clean_html_removes_tags():
    html = "<html><body><h1>Hello</h1><script>alert(1)</script><p>World</p></body></html>"
    assert clean_html(html) == "Hello World"


def test_fetch_invalid_url_returns_failure():
    article = asyncio.run(fetch_and_extract_content("http://127.0.0.1:9/unreachable"))
    assert article.success is False
    assert article.error
    assert article.summary
