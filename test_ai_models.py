#!/usr/bin/env python3
"""Test script for multi-model AI extraction functionality"""

import os
import sys
sys.path.append('.')

from backend.ai_extractor import AIExtractor
from backend.scraper import fetch_and_extract_content, clean_html


async def test_extraction():
    """Test extraction with different AI providers"""
    test_url = "https://example.com"

    print("Testing multi-model AI extraction...")
    print("=" * 50)

    # Fetch test content
    title, main_content, raw_html = await fetch_and_extract_content(test_url)

    if not main_content:
        print("Failed to fetch test content")
        return

    clean_text = clean_html(main_content)

    # Test each configured provider
    providers = [name for name in AIExtractor.PROVIDERS if AIExtractor.is_provider_configured(name)]

    if not providers:
        print("No AI providers configured")
        print("Please set API keys in environment variables:")
        for name in AIExtractor.PROVIDERS:
            api_key_env = name.upper() + "_API_KEY"
            print(f"- {api_key_env}")
        return

    print(f"Testing {len(providers)} configured providers...")

    for provider_name in providers:
        print("\n" + "-" * 50)
        print(f"Testing {AIExtractor.PROVIDERS[provider_name].get_provider_name()}")
        print("-" * 50)

        try:
            extractor = AIExtractor(provider_name)
            result = await extractor.extract_knowledge_graph(clean_text, title)

            print(f"✓ Success")
            print(f"Article ID: {result.get('article_id', 'N/A')}")
            print(f"Title: {result.get('title', 'N/A')}")
            print(f"Core concepts: {len(result.get('core_concepts', []))}")
            print(f"Entities: {len(result.get('entities', []))}")
            print(f"Relations: {len(result.get('relations', []))}")
            print(f"Stance: {result.get('stance', 'N/A')[:100]}...")
            print(f"Keywords: {len(result.get('keywords', []))}")

        except Exception as e:
            print(f"✗ Error: {e}")


if __name__ == "__main__":
    import asyncio

    try:
        asyncio.run(test_extraction())
    except KeyboardInterrupt:
        print("\nTest interrupted by user")