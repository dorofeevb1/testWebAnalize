def run_rules(result: dict) -> list[dict]:
    issues = []

    http_status = result.get("http_status")
    page_title = result.get("page_title", "").strip()
    has_description = result.get("has_meta_description", False)
    has_viewport = result.get("has_viewport", False)
    has_canonical = result.get("has_canonical", False)

    if http_status is not None and http_status >= 400:
        issues.append(
            {
                "rule": "http-status",
                "severity": "error",
                "title": "Page returns an HTTP error",
                "message": f"Target returned HTTP {http_status}.",
            }
        )

    if not page_title:
        issues.append(
            {
                "rule": "page-title",
                "severity": "warning",
                "title": "Page has no title",
                "message": (
                    "The HTML document does not contain "
                    "a usable <title>."
                ),
            }
        )

    elif len(page_title) < 10:
        issues.append(
            {
                "rule": "page-title-length",
                "severity": "warning",
                "title": "Page title is too short",
                "message": (
                    f'The page title is only {len(page_title)} '
                    "characters long."
                ),
            }
        )

    elif len(page_title) > 60:
        issues.append(
            {
                "rule": "page-title-length",
                "severity": "warning",
                "title": "Page title is too long",
                "message": (
                    f'The page title is {len(page_title)} '
                    "characters long."
                ),
            }
        )

    if not has_description:
        issues.append(
            {
                "rule": "meta-description",
                "severity": "warning",
                "title": "Page has no meta description",
                "message": (
                    "The HTML document does not contain "
                    'a meta description.'
                ),
            }
        )

    if not has_viewport:
        issues.append(
            {
                "rule": "viewport",
                "severity": "warning",
                "title": "Page has no viewport declaration",
                "message": (
                    "The HTML document does not contain "
                    'a viewport meta tag.'
                ),
            }
        )

    if not has_canonical:
        issues.append(
            {
                "rule": "canonical",
                "severity": "warning",
                "title": "Page has no canonical URL",
                "message": (
                    "The HTML document does not contain "
                    "a canonical link."
                ),
            }
        )

    return issues