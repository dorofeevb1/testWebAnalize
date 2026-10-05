import uuid

from django.db import models


class Audit(models.Model):
    class Status(models.TextChoices):
        QUEUED = "queued", "Queued"
        RUNNING = "running", "Running"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    target_url = models.URLField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.QUEUED,
    )

    http_status = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    response_time_ms = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    content_type = models.CharField(
        max_length=255,
        blank=True,
    )

    page_title = models.CharField(
        max_length=500,
        blank=True,
    )

    error_message = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    started_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    issues = models.JSONField(
        default=list,
        blank=True,
    )
    
    def __str__(self):
        return str(self.id)