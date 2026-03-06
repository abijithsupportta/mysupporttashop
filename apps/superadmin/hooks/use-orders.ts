"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import {
  fetchOrders as getOrders,
  type OrdersResponse
} from "@/lib/services/client/orders-service";

interface OrdersSummary {
  total_revenue: number;
  total_commission: number;
}

interface OrdersParams {
  page: number;
  limit: number;
  search: string;
  order_status: OrderStatus | "all";
  payment_status: PaymentStatus | "all";
  vendor_id: string;
  from_date: string;
  to_date: string;
}

export function useOrders(initial: Partial<OrdersParams> = {}) {
  const [params, setParams] = useState<OrdersParams>({
    page: initial.page ?? 1,
    limit: initial.limit ?? 10,
    search: initial.search ?? "",
    order_status: initial.order_status ?? "all",
    payment_status: initial.payment_status ?? "all",
    vendor_id: initial.vendor_id ?? "all",
    from_date: initial.from_date ?? "",
    to_date: initial.to_date ?? ""
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<OrdersSummary>({
    total_revenue: 0,
    total_commission: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result: OrdersResponse = await getOrders(params);

      setOrders(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.total_pages || 1);
      setSummary(result.summary);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to fetch orders";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return {
    orders,
    total,
    totalPages,
    summary,
    loading,
    error,
    params,
    setParams,
    refetch: loadOrders
  };
}
