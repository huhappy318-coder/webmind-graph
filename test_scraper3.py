import asyncio

from backend.scraper import fetch_and_extract_content


def test_fetch_example_com_or_fallback():
    article = asyncio.run(fetch_and_extract_content("https://example.com"))
    assert article.url == "https://example.com"
    assert isinstance(article.success, bool)
    assert article.summary is not None
