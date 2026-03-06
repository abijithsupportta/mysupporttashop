import { NextRequest } from "next/server";
import { z } from "zod";
import { updateVendorStatusService } from "@/lib/services/server/vendors-service";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";
import { parseJsonBody } from "@/lib/api/validation";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { logAuditEvent } from "@/lib/api/audit-logger";

const schema = z.object({
  is_active: z.boolean()
});

export const PATCH = apiHandler(
  withSuperadminAuth(
    async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> },
      auth
    ) => {
    const { id } = await params;
    const { is_active } = await parseJsonBody(request, schema);

    const updated = await updateVendorStatusService(id, is_active);

    await logAuditEvent({
      actor_user_id: auth.userId,
      actor_email: auth.email,
      action: "vendor.status.updated",
      resource_type: "vendor",
      resource_id: id,
      metadata: { is_active }
    });

    return successResponse(updated, 200);
  })
);
