import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import Audit
from .queue import enqueue_audit


@csrf_exempt
@require_POST
def create_audit(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {
                "error": {
                    "code": "INVALID_JSON",
                    "message": "Некорректный JSON",
                }
            },
            status=400,
        )

    url = data.get("url")

    if not isinstance(url, str) or not url.strip():
        return JsonResponse(
            {
                "error": {
                    "code": "INVALID_URL",
                    "message": "Некорректный URL",
                }
            },
            status=400,
        )

    audit = Audit.objects.create(
        target_url=url.strip(),
        status=Audit.Status.QUEUED,
    )

    enqueue_audit(str(audit.id))

    return JsonResponse(
        {
            "id": str(audit.id),
            "status": audit.status,
        },
        status=202,
    )


@require_GET
def get_audit(request, audit_id):
    try:
        audit = Audit.objects.get(id=audit_id)
    except Audit.DoesNotExist:
        return JsonResponse(
            {
                "error": {
                    "code": "AUDIT_NOT_FOUND",
                    "message": "Аудит не найден",
                }
            },
            status=404,
        )

    return JsonResponse(
        {
            "id": str(audit.id),
            "targetUrl": audit.target_url,
            "status": audit.status,
            "httpStatus": audit.http_status,
            "responseTimeMs": audit.response_time_ms,
            "contentType": audit.content_type,
            "pageTitle": audit.page_title,
            "issues": audit.issues,
            "errorMessage": audit.error_message,
            "createdAt": audit.created_at.isoformat(),
            "startedAt": (
                audit.started_at.isoformat()
                if audit.started_at
                else None
            ),
            "completedAt": (
                audit.completed_at.isoformat()
                if audit.completed_at
                else None
            ),
        }
)