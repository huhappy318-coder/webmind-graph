from __future__ import annotations

import re

import httpx
from bs4 import BeautifulSoup
from readability import Document

from .models import ArticleContent


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0 Safari/537.36 WebMindGraph/0.2"
)
REQUEST_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Cache-Control": "no-cache",
}
REQUEST_TIMEOUT = httpx.Timeout(connect=6.0, read=12.0, write=6.0, pool=6.0)


async def fetch_and_extract_content(url: str) -> ArticleContent:
    try:
        async with httpx.AsyncClient(
            timeout=REQUEST_TIMEOUT,
            follow_redirects=True,
            headers=REQUEST_HEADERS,
        ) as client:
            response = await client.get(url)
    except httpx.ConnectTimeout:
        return _failure_result(url, "The site took too long to accept a connection.")
    except httpx.ReadTimeout:
        return _failure_result(url, "The site responded too slowly and timed out.")
    except httpx.ConnectError:
        return _failure_result(url, "Could not connect to the target site.")
    except httpx.InvalidURL:
        return _failure_result(url, "The URL format is invalid.")
    except httpx.HTTPError:
        return _failure_result(url, "The request failed before a response was received.")
    except Exception:
        return _failure_result(url, "An unexpected fetch error occurred.")

    if response.status_code != 200:
        return _failure_result(
            url,
            f"The site returned HTTP {response.status_code}.",
            title="Request blocked or unavailable",
        )

    html = response.text or ""
    if not html.strip():
        return _failure_result(url, "The response body was empty.", title="Empty response")

    soup = BeautifulSoup(html, "html.parser")
    title = _extract_title(soup, url)

    readable_text = ""
    try:
        document = Document(html)
        readable_text = clean_html(document.summary(html_partial=True))
        title = clean_html(document.short_title() or "") or title
    except Exception:
        readable_text = ""

    if not readable_text:
        readable_text = _extract_fallback_text(soup)

    if not readable_text:
        readable_text = clean_html(html)

    readable_text = readable_text[:12000].strip()
    if not readable_text:
        return _failure_result(
            url,
            "The page loaded, but no readable article text could be extracted. Try pasting manual text instead.",
            title=title or "No readable content",
        )

    return ArticleContent(
        title=title or url,
        url=url,
        content=readable_text,
        summary=_summarize(readable_text),
        success=True,
        error=None,
        content_length=len(readable_text),
        source_type="url",
    )


def clean_html(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg", "canvas", "iframe", "template"]):
        tag.decompose()
    text = soup.get_text(" ", strip=True)
    text = re.sub(r"[\r\n\t]+", " ", text)
    return re.sub(r"\s{2,}", " ", text).strip()


def _extract_title(soup: BeautifulSoup, url: str) -> str:
    for selector in ("meta[property='og:title']", "meta[name='twitter:title']"):
        element = soup.select_one(selector)
        if element and element.get("content"):
            return clean_html(element["content"])
    if soup.title:
        return clean_html(soup.title.get_text(" ", strip=True))
    heading = soup.find(["h1", "h2"])
    if heading:
        return clean_html(heading.get_text(" ", strip=True))
    return url


def _extract_fallback_text(soup: BeautifulSoup) -> str:
    candidates = []
    for selector in ("article", "main", "[role='main']", ".content", ".article", ".post", "body"):
        for element in soup.select(selector):
            text = clean_html(str(element))
            if len(text) >= 180:
                candidates.append(text)
        if candidates:
            break
    if not candidates:
        paragraphs = [clean_html(str(p)) for p in soup.find_all("p")]
        candidates = [text for text in paragraphs if len(text) >= 80]
    return max(candidates, key=len) if candidates else ""


def _summarize(text: str) -> str:
    sentences = re.split(r"(?<=[.!?\u3002\uff01\uff1f])\s+", text.strip())
    summary = " ".join(sentence.strip() for sentence in sentences[:3] if sentence.strip())
    return summary[:420] or text[:420]


def _failure_result(url: str, message: str, title: str = "Fetch failed") -> ArticleContent:
    return ArticleContent(
        title=title,
        url=url,
        content="",
        summary=message,
        success=False,
        error=message,
        content_length=0,
        source_type="url",
    )
