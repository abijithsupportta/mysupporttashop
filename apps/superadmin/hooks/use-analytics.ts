"use client";

import { useCallback, useEffect, useState } from "react";
import type { RevenuePoint, TopVendor } from "@/types/analytics";
import {
  fetchRevenueAnalytics,
  fetchTopVendors
} from "@/lib/services/client/analytics-service";

export function useAnalytics(days = 30, topLimit = 8) {
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [vendors, setVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [revenueResponse, topVendorsResponse] = await Promise.all([
        fetchRevenueAnalytics(days),
        fetchTopVendors(topLimit)
      ]);

      setRevenue(revenueResponse.points);
      setVendors(topVendorsResponse.vendors);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to fetch analytics";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [days, topLimit]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { revenue, vendors, loading, error, refetch };
}
