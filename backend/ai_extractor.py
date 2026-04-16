from __future__ import annotations

import os
from typing import Any

from .providers.mock_provider import MockProvider


class AIExtractor:
    PROVIDERS = {
        "anthropic": {
            "display_name": "Anthropic Claude",
            "api_key_env": "ANTHROPIC_API_KEY",
            "provider": MockProvider,
        },
        "openai": {
            "display_name": "OpenAI GPT-4o",
            "api_key_env": "OPENAI_API_KEY",
            "provider": MockProvider,
        },
        "gemini": {
            "display_name": "Google Gemini",
            "api_key_env": "GEMINI_API_KEY",
            "provider": MockProvider,
        },
        "deepseek": {
            "display_name": "DeepSeek",
            "api_key_env": "DEEPSEEK_API_KEY",
            "provider": MockProvider,
        },
        "qwen": {
            "display_name": "Qwen/\u901a\u4e49\u5343\u95ee",
            "api_key_env": "QWEN_API_KEY",
            "provider": MockProvider,
        },
        "kimi": {
            "display_name": "Kimi/\u6708\u4e4b\u6697\u9762",
            "api_key_env": "KIMI_API_KEY",
            "provider": MockProvider,
        },
        "mock": {
            "display_name": "Mock Model",
            "api_key_env": None,
            "provider": MockProvider,
        },
    }

    def __init__(self, provider_name: str | None = None):
        requested = (provider_name or os.getenv("ACTIVE_MODEL", "mock")).strip().lower()
        self.requested_provider = requested
        self.provider_name = requested if requested in self.PROVIDERS else "mock"
        self.provider = self.PROVIDERS[self.provider_name]["provider"]()

    @classmethod
    def is_provider_configured(cls, name: str) -> bool:
        info = cls.PROVIDERS.get(name)
        if not info:
            return False
        api_key_env = info.get("api_key_env")
        return True if api_key_env is None else bool(os.getenv(str(api_key_env)))

    @classmethod
    def resolve_model(cls, name: str | None) -> tuple[str, bool]:
        requested = (name or "mock").strip().lower()
        if requested not in cls.PROVIDERS:
            return "mock", False
        if not cls.is_provider_configured(requested):
            return "mock", requested == "mock"
        return requested, requested == "mock"

    @classmethod
    def available_models(cls) -> list[dict[str, Any]]:
        models = []
        for name, info in cls.PROVIDERS.items():
            configured = cls.is_provider_configured(name)
            models.append(
                {
                    "name": name,
                    "display_name": info["display_name"],
                    "configured": configured,
                    "default": name == "mock",
                    "available_for_use": configured or name == "mock",
                }
            )
        return models

    async def extract_knowledge_graph(
        self,
        text: str,
        title: str = "",
        source_id: str = "",
    ) -> dict[str, Any]:
        if not self.is_provider_configured(self.provider_name):
            self.provider_name = "mock"
            self.provider = MockProvider()
        return await self.provider.extract(text, title=title, source_id=source_id)
