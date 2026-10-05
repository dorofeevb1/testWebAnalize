import time

import httpx


def analyze_url(url: str) -> dict:
    started_at = time.perf_counter()

    with httpx.Client(
        follow_redirects=True,
        timeout=15.0,
        headers={
            "User-Agent": "WebAuditBot/1.0",
        },
    ) as client:
        response = client.get(url)

    response_time_ms = round(
        (time.perf_counter() - started_at) * 1000
    )

    content_type = response.headers.get(
        "content-type",
        "",
    )

    page_title = ""

    if "text/html" in content_type:
        text = response.text

        start = text.lower().find("<title>")

        if start != -1:
            start += len("<title>")
            end = text.lower().find("</title>", start)

            if end != -1:
                page_title = text[start:end].strip()

    return {
        "http_status": response.status_code,
        "response_time_ms": response_time_ms,
        "content_type": content_type[:255],
        "page_title": page_title[:500],
    }