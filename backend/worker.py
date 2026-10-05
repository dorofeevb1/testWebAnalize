import os

import django
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django.setup()

from audits.analyzer import analyze_url
from audits.models import Audit
from audits.queue import dequeue_audit
from audits.rules import run_rules


def main():
    print("Audit worker started")

    while True:
        job = dequeue_audit()

        if job is None:
            continue

        audit_id = job["audit_id"]

        try:
            audit = Audit.objects.get(id=audit_id)
        except Audit.DoesNotExist:
            print(f"Audit {audit_id} not found")
            continue

        if audit.status != Audit.Status.QUEUED:
            continue

        audit.status = Audit.Status.RUNNING
        audit.started_at = timezone.now()
        audit.save(
            update_fields=[
                "status",
                "started_at",
            ]
        )

        print(f"Audit {audit.id} is running")

        try:
            result = analyze_url(audit.target_url)
            issues = run_rules(result)

            audit.http_status = result["http_status"]
            audit.response_time_ms = result["response_time_ms"]
            audit.content_type = result["content_type"]
            audit.page_title = result["page_title"]
            audit.issues = issues
            audit.status = Audit.Status.COMPLETED
            audit.completed_at = timezone.now()

            audit.save(
                update_fields=[
                    "http_status",
                    "response_time_ms",
                    "content_type",
                    "page_title",
                    "issues",
                    "status",
                    "completed_at",
                ]
            )

            print(
                f"Audit {audit.id} completed "
                f"({audit.http_status}, "
                f"{audit.response_time_ms} ms, "
                f"{len(issues)} issues)"
            )

        except Exception as error:
            audit.status = Audit.Status.FAILED
            audit.error_message = str(error)
            audit.completed_at = timezone.now()

            audit.save(
                update_fields=[
                    "status",
                    "error_message",
                    "completed_at",
                ]
            )

            print(
                f"Audit {audit.id} failed: {error}"
            )


if __name__ == "__main__":
    main()