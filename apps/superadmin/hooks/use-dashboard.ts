"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "@/types/dashboard";
import { fetchDashboardStats } from "@/lib/services/client/dashboard-service";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result: DashboardStats = await fetchDashboardStats();
      setStats(result);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to load dashboard";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
    const timer = setInterval(() => {
      void refetch();
    }, 30000);

    return () => clearInterval(timer);
  }, [refetch]);

  return { stats, loading, error, refetch };
}
