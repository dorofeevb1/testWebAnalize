import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { createAudit } from "../../api/audits";
import "./AuditForm.scss";

const auditUrlSchema = z
  .string()
  .trim()
  .url()
  .refine(
    (value) => {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:";
    },
    {
      message: "URL должен начинаться с http:// или https://",
    },
  );

function AuditForm() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  const createAuditMutation = useMutation({
    mutationFn: createAudit,
    onSuccess: (audit) => {
      navigate(`/audits/${audit.id}`);
    },
  });

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = auditUrlSchema.safeParse(url);

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Некорректный URL");
      return;
    }

    setValidationError("");
    createAuditMutation.mutate(result.data);
  };

  const error =
    validationError ||
    (createAuditMutation.error instanceof Error
      ? createAuditMutation.error.message
      : "");

  const isSubmitting = createAuditMutation.isPending;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="label" htmlFor="audit-url">
        Website URL
      </label>

      <div className="row">
        <input
          className="input"
          id="audit-url"
          name="url"
          type="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setValidationError("");

            if (createAuditMutation.error) {
              createAuditMutation.reset();
            }
          }}
          placeholder="https://example.com"
          autoComplete="url"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "audit-url-error" : undefined}
          disabled={isSubmitting}
        />

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Starting..." : "Run audit"}
        </button>
      </div>

      {error && (
        <p className="error" id="audit-url-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default AuditForm;
