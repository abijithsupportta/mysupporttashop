import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";
import { ensureSuccessPagination, getJson } from "@/lib/services/client/api-client";

interface OrdersSummary {
  total_revenue: number;
  total_commission: number;
}

export interface OrdersResponse extends PaginatedResponse<Order> {
  summary: OrdersSummary;
}

export interface OrdersParams {
  page: number;
  limit: number;
  search: string;
  order_status: OrderStatus | "all";
  payment_status: PaymentStatus | "all";
  vendor_id: string;
  from_date: string;
  to_date: string;
}

export async function fetchOrders(params: OrdersParams): Promise<OrdersResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    search: params.search,
    order_status: params.order_status,
    payment_status: params.payment_status,
    vendor_id: params.vendor_id,
    from_date: params.from_date,
    to_date: params.to_date
  });

  const result = await getJson<OrdersResponse>(`/api/v1/orders?${query.toString()}`);
  const paginated = ensureSuccessPagination(result);

  return {
    ...paginated,
    summary: result.summary
  };
}
