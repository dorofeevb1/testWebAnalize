from django.urls import path

from .views import create_audit, get_audit

urlpatterns = [
    path("api/audits", create_audit),
    path("api/audits/<uuid:audit_id>", get_audit),
]