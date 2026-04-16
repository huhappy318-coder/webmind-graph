"""Prompt placeholders for future real AI providers.

The MVP uses a deterministic mock provider. These prompts are kept in one
place so the next version can wire OpenAI, Claude, Gemini, or other providers
without changing the rest of the application.
"""

KNOWLEDGE_GRAPH_SYSTEM_PROMPT = """
Extract a concise knowledge graph from an article. Return concepts, entities,
relations, keywords, and a short summary in structured JSON.
"""

