import type { PaginatedResponse } from "@/types/api";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { listOrders } from "@/lib/repositories/orders-repository";
import { toOrders, toOrdersSummary } from "@/lib/transformers/orders";

interface OrdersSummary {
  total_revenue: number;
  total_commission: number;
}

export interface OrdersListParams {
  page?: number;
  limit?: number;
  search?: string;
  order_status?: OrderStatus | "all";
  payment_status?: PaymentStatus | "all";
  vendor_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface OrdersServiceResult extends PaginatedResponse<Order> {
  summary: OrdersSummary;
}

export async function listOrdersService(params: OrdersListParams): Promise<OrdersServiceResult> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;

  const result = await listOrders({
    page,
    limit,
    search: (params.search ?? "").trim(),
    order_status: params.order_status ?? "all",
    payment_status: params.payment_status ?? "all",
    vendor_id: params.vendor_id ?? "all",
    from_date: params.from_date ?? "",
    to_date: params.to_date ?? ""
  });

  return {
    success: true,
    data: toOrders(result.rows),
    total: result.totalCount,
    page,
    limit,
    total_pages: Math.ceil(result.totalCount / limit),
    summary: toOrdersSummary(result.summaryRows)
  };
}
