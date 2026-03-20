#!/usr/bin/env python3
"""Test script for URL scraping functionality"""

import asyncio
import sys
sys.path.append('.')
import ssl

from backend.scraper import fetch_and_extract_content, clean_html


async def test_scrape():
    """Test the scraping functionality with sample URLs"""
    test_urls = [
        "https://example.com",
        "https://wikipedia.org/wiki/Artificial_intelligence",
        "https://www.nytimes.com/2024/01/01/technology/artificial-intelligence-2024.html"
    ]

    print("Testing URL scraping functionality...")
    print("=" * 50)

    for i, url in enumerate(test_urls, 1):
        print(f"\n{i}. Testing: {url}")
        print("-" * 50)

        try:
            title, main_content, raw_html = await fetch_and_extract_content(url)

            if title and main_content:
                print("Success!")
                print(f"Title: {title}")

                clean_text = clean_html(main_content)
                print(f"Content length: {len(clean_text)} characters")
                print(f"First 200 characters:\n{clean_text[:200]}...")

            else:
                print("Failed to extract content")

        except Exception as e:
            print(f"Error: {e}")
            import traceback
            print(traceback.format_exc())

    print("\n" + "=" * 50)
    print("Test completed!")


if __name__ == "__main__":
    try:
        asyncio.run(test_scrape())
    except KeyboardInterrupt:
        print("\nTest interrupted by user")