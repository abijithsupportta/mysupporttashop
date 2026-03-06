"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchSystemHealth,
  type SystemHealth
} from "@/lib/services/client/system-service";

export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchSystemHealth();
      setHealth(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to fetch system health";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
    const timer = setInterval(() => {
      void refetch();
    }, 45000);

    return () => clearInterval(timer);
  }, [refetch]);

  return { health, loading, error, refetch };
}
