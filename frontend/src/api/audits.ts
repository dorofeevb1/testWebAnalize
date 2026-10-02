import { z } from "zod";

const auditStatusSchema = z.enum(["queued", "running", "completed", "failed"]);

const auditSchema = z.object({
  id: z.string(),
  targetUrl: z.string().url(),
  status: auditStatusSchema,
});

const createAuditResponseSchema = z.object({
  id: z.string(),
  status: z.literal("queued"),
});

export type AuditStatus = z.infer<typeof auditStatusSchema>;
export type Audit = z.infer<typeof auditSchema>;
export type CreateAuditResponse = z.infer<typeof createAuditResponseSchema>;

export async function createAudit(url: string): Promise<CreateAuditResponse> {
  const response = await fetch("/api/audits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Не удалось создать аудит");
  }

  const data: unknown = await response.json();

  return createAuditResponseSchema.parse(data);
}

export async function getAudit(id: string): Promise<Audit> {
  const response = await fetch(`/api/audits/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Аудит не найден");
    }

    throw new Error("Не удалось загрузить аудит");
  }

  const data: unknown = await response.json();

  return auditSchema.parse(data);
}
