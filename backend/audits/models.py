import uuid

from django.db import models


class Audit(models.Model):
    class Status(models.TextChoices):
        QUEUED = "queued", "Queued"
        RUNNING = "running", "Running"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    target_url = models.URLField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.QUEUED,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)