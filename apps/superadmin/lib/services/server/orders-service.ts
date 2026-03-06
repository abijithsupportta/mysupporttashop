import type { PaginationMeta } from "@/types/api";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import {
  getOrderById,
  listOrders,
  updateOrderStatusById
} from "@/lib/repositories/orders-repository";
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

export interface OrdersServiceResult {
  success: boolean;
  data: Order[];
  meta: PaginationMeta;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
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

  const totalPages = Math.max(1, Math.ceil(result.totalCount / limit));

  return {
    success: true,
    data: toOrders(result.rows),
    total: result.totalCount,
    page,
    limit,
    total_pages: totalPages,
    meta: {
      total: result.totalCount,
      page,
      limit,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1
    },
    summary: toOrdersSummary(result.summaryRows)
  };
}

export async function getOrderDetailService(orderId: string): Promise<Order | null> {
  const row = await getOrderById(orderId);
  if (!row) {
    return null;
  }

  const [order] = toOrders([row]);
  return order ?? null;
}

export async function updateOrderStatusService(orderId: string, orderStatus: OrderStatus) {
  const row = await updateOrderStatusById(orderId, orderStatus);
  if (!row) {
    return null;
  }

  const [order] = toOrders([row]);
  return order ?? null;
}
