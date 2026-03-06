import { NextRequest } from "next/server";
import { z } from "zod";
import { listOrdersService } from "@/lib/services/server/orders-service";
import type { OrderStatus, PaymentStatus } from "@/types/order";
import { apiHandler } from "@/lib/api/api-handler";
import { paginatedResponse } from "@/lib/api/api-response";
import { parseQuery } from "@/lib/api/validation";
import { paginationSchema } from "@/lib/api/pagination";
import { withSuperadminAuth } from "@/lib/api/with-auth";

const ordersQuerySchema = paginationSchema.extend({
  order_status: z
    .enum(["all", "pending", "processing", "shipped", "delivered", "cancelled"])
    .optional()
    .default("all"),
  payment_status: z
    .enum(["all", "pending", "paid", "failed", "refunded"])
    .optional()
    .default("all"),
  vendor_id: z.string().optional().default("all"),
  from_date: z.string().optional().default(""),
  to_date: z.string().optional().default("")
});

export const GET = apiHandler(
  withSuperadminAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const query = parseQuery(ordersQuerySchema, searchParams);

    const order_status = query.order_status as OrderStatus | "all";
    const payment_status = query.payment_status as PaymentStatus | "all";

    const result = await listOrdersService({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search ?? "",
      order_status,
      payment_status,
      vendor_id: query.vendor_id ?? "all",
      from_date: query.from_date ?? "",
      to_date: query.to_date ?? ""
    });

    return paginatedResponse(result.data, result.meta, 200, {
      summary: result.summary,
      sort_by: query.sort_by,
      sort_order: query.sort_order
    });
  })
);
