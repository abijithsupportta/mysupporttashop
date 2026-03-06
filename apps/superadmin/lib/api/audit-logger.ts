import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/api/logger";

export interface AuditEventInput {
  actor_user_id: string;
  actor_email?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(event: AuditEventInput) {
  logger.info("audit-event", event);

  const supabase = getSupabaseAdminClient();
  const response = await supabase.from("audit_logs").insert({
    actor_user_id: event.actor_user_id,
    actor_email: event.actor_email ?? null,
    action: event.action,
    resource_type: event.resource_type,
    resource_id: event.resource_id ?? null,
    metadata: event.metadata ?? null
  });

  if (response.error) {
    const msg = response.error.message.toLowerCase();
    const isMissingAuditTable = msg.includes("audit_logs") && msg.includes("does not exist");

    if (!isMissingAuditTable) {
      logger.warn("audit-log-insert-failed", {
        message: response.error.message,
        event
      });
    }
  }
}
