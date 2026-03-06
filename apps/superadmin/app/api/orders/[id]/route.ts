import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { ApiError } from "@/lib/api/error";
import { successResponse } from "@/lib/api/api-response";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { getOrderDetailService } from "@/lib/services/server/orders-service";

export const GET = apiHandler(
  withSuperadminAuth(
    async (
      _request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      const order = await getOrderDetailService(id);

      if (!order) {
        throw new ApiError("Order not found", 404);
      }

      return successResponse(order, 200);
    }
  )
);
