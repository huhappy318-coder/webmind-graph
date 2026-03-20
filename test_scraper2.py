#!/usr/bin/env python3
"""Test script for URL scraping functionality with accessible URLs"""

import asyncio
import sys
sys.path.append('.')

from backend.scraper import fetch_and_extract_content, clean_html


async def test_scrape():
    """Test the scraping functionality with accessible URLs"""
    test_urls = [
        "https://example.com",
        "https://towardsdatascience.com/what-is-machine-learning-768433ad9477",
        "https://www.sciencedaily.com/releases/2024/01/240101141524.htm"
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