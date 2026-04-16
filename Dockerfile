FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ACTIVE_MODEL=mock

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libssl-dev \
    libxml2-dev \
    libxslt1-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.legacy.txt .
RUN pip install --no-cache-dir -r requirements.legacy.txt

COPY backend ./backend
COPY frontend ./frontend
COPY .env.example ./.env.example

RUN useradd -m -u 1000 webmind
USER webmind

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=3).read()"

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]
