import { NextRequest } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/api-handler";
import { ApiError } from "@/lib/api/error";
import { successResponse } from "@/lib/api/api-response";
import { parseJsonBody } from "@/lib/api/validation";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { updateOrderStatusService } from "@/lib/services/server/orders-service";
import { logAuditEvent } from "@/lib/api/audit-logger";

const schema = z.object({
  order_status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"])
});

export const PATCH = apiHandler(
  withSuperadminAuth(
    async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> },
      auth
    ) => {
      const { id } = await params;
      const { order_status } = await parseJsonBody(request, schema);
      const order = await updateOrderStatusService(id, order_status);

      if (!order) {
        throw new ApiError("Order not found", 404);
      }

      await logAuditEvent({
        actor_user_id: auth.userId,
        actor_email: auth.email,
        action: "order.status.updated",
        resource_type: "order",
        resource_id: id,
        metadata: { order_status }
      });

      return successResponse(order, 200);
    }
  )
);
