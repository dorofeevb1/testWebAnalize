import json

import redis
from django.conf import settings


QUEUE_NAME = "audit_jobs"

redis_client = redis.Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
    socket_timeout=None,
)


def enqueue_audit(audit_id: str) -> None:
    redis_client.rpush(
        QUEUE_NAME,
        json.dumps(
            {
                "audit_id": audit_id,
            }
        ),
    )


def dequeue_audit() -> dict | None:
    item = redis_client.blpop(
        QUEUE_NAME,
        timeout=0,
    )

    if item is None:
        return None

    _, payload = item

    return json.loads(payload)