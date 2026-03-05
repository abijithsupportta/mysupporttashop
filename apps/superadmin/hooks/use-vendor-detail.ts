"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchVendorDetail,
  patchVendorStatus,
  type VendorDetailData
} from "@/lib/services/client/vendors-service";

interface UseVendorDetailParams {
  vendorId: string;
  initialPage?: number;
  pageSize?: number;
}

export function useVendorDetail({
  vendorId,
  initialPage = 1,
  pageSize = 10
}: UseVendorDetailParams) {
  const [page, setPage] = useState(initialPage);
  const [detail, setDetail] = useState<VendorDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (!vendorId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchVendorDetail(vendorId, page, pageSize);
      setDetail(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to fetch vendor";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, vendorId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const toggleStatus = useCallback(async () => {
    if (!detail) {
      return;
    }

    await patchVendorStatus(detail.vendor.id, !detail.vendor.is_active);
    await refetch();
  }, [detail, refetch]);

  return {
    page,
    setPage,
    detail,
    loading,
    error,
    refetch,
    toggleStatus
  };
}
