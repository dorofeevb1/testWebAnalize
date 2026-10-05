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
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status === "queued" || status === "running") {
        return 1000;
      }

      return false;
    },
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

          <div>
            <dt>HTTP status</dt>
            <dd>{audit.httpStatus ?? "—"}</dd>
          </div>

          <div>
            <dt>Response time</dt>
            <dd>
              {audit.responseTimeMs !== null
                ? `${audit.responseTimeMs} ms`
                : "—"}
            </dd>
          </div>

          <div>
            <dt>Content-Type</dt>
            <dd>{audit.contentType || "—"}</dd>
          </div>

          <div>
            <dt>Page title</dt>
            <dd>{audit.pageTitle || "—"}</dd>
          </div>
        </dl>

        {audit.issues.length > 0 && (
          <section className="audit-issues">
            <div className="audit-issues-header">
              <p className="audit-label">Issues</p>

              <p className="audit-issues-count">{audit.issues.length}</p>
            </div>

            <div className="audit-issues-list">
              {audit.issues.map((issue) => (
                <article
                  className="audit-issue"
                  key={`${issue.rule}-${issue.title}`}
                >
                  <div className="audit-issue-marker" aria-hidden="true">
                    !
                  </div>

                  <div className="audit-issue-content">
                    <p className="audit-issue-severity">{issue.severity}</p>

                    <h2 className="audit-issue-title">{issue.title}</h2>

                    <p className="audit-issue-message">{issue.message}</p>

                    <p className="audit-issue-rule">{issue.rule}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {audit.status === "failed" && audit.errorMessage && (
          <section className="audit-status">
            <div className="audit-status-mark" aria-hidden="true">
              !
            </div>

            <div>
              <p className="audit-status-label">Error</p>

              <p className="audit-status-value">{audit.errorMessage}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default AuditPage;
