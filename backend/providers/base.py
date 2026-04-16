from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class BaseProvider(ABC):
    name = "base"
    display_name = "Base Provider"

    @classmethod
    def is_configured(cls) -> bool:
        return False

    @abstractmethod
    async def extract(self, text: str, title: str = "", source_id: str = "") -> dict[str, Any]:
        """Return graph-like extraction data for one article."""

