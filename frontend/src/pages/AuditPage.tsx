import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getAudit } from "../api/audits";
import "./AuditPage.scss";

function AuditPage() {
  const { id } = useParams<{ id: string }>();

  const auditQuery = useQuery({
    queryKey: ["audit", id],
    queryFn: () => getAudit(id!),
    enabled: Boolean(id),
  });

  if (auditQuery.isPending) {
    return (
      <main className="audit-page">
        <div className="audit-content">
          <p>Loading audit...</p>
        </div>
      </main>
    );
  }

  if (auditQuery.isError) {
    return (
      <main className="audit-page">
        <div className="audit-content">
          <Link className="audit-back" to="/">
            ← New audit
          </Link>

          <h1 className="audit-title">Audit unavailable</h1>

          <p>{auditQuery.error.message}</p>
        </div>
      </main>
    );
  }

  const audit = auditQuery.data;

  return (
    <main className="audit-page">
      <div className="audit-content">
        <header className="audit-header">
          <Link className="audit-back" to="/">
            ← New audit
          </Link>

          <p className="audit-label">Audit</p>
          <h1 className="audit-title">{audit.status}</h1>
        </header>

        <section className="audit-status" aria-live="polite">
          <div className="audit-status-mark" aria-hidden="true">
            01
          </div>

          <div>
            <p className="audit-status-label">Status</p>
            <p className="audit-status-value">{audit.status}</p>
          </div>
        </section>

        <dl className="audit-meta">
          <div>
            <dt>Audit ID</dt>
            <dd>{audit.id}</dd>
          </div>

          <div>
            <dt>Target</dt>
            <dd>{audit.targetUrl}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}

export default AuditPage;
