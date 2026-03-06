import { NextRequest } from "next/server";
import { z } from "zod";
import { sendResendTestEmail } from "@/lib/services/server/vendor-email-service";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";
import { parseJsonBody } from "@/lib/api/validation";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { logAuditEvent } from "@/lib/api/audit-logger";

const emailTestSchema = z
  .object({
    to: z.string().email().optional()
  })
  .optional();

export const POST = apiHandler(
  withSuperadminAuth(async (request: NextRequest, _context, auth) => {
    let to = "info@abijithcb.com";

    if (request.headers.get("content-length")) {
      const payload = await parseJsonBody(request, emailTestSchema);
      if (payload?.to) {
        to = payload.to;
      }
    }

    const result = await sendResendTestEmail(to);

    await logAuditEvent({
      actor_user_id: auth.userId,
      actor_email: auth.email,
      action: "email.test.sent",
      resource_type: "email",
      resource_id: to,
      metadata: { to }
    });

    return successResponse(
      {
        to: result.to,
        message: "Test email sent successfully"
      },
      200
    );
  })
);
