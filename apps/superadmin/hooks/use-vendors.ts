"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createVendor,
  deleteVendor,
  fetchVendors as getVendors,
  patchVendorStatus,
  updateVendor,
  type VendorCreatePayload,
  type VendorUpdatePayload,
  type VendorsParams
} from "@/lib/services/client/vendors-service";
import type { Vendor } from "@/types/vendor";

export type { VendorsParams };

export function useVendors(initial: Partial<VendorsParams> = {}) {
  const [params, setParams] = useState<VendorsParams>({
    page: initial.page ?? 1,
    limit: initial.limit ?? 10,
    search: initial.search ?? "",
    status: initial.status ?? "all"
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVendors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getVendors(params);

      setVendors(result.data);
      setTotal(result.total);
      setTotalPages(result.total_pages || 1);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to fetch vendors";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void loadVendors();
  }, [loadVendors]);

  async function updateVendorStatus(id: string, is_active: boolean) {
    await patchVendorStatus(id, is_active);

    await loadVendors();
  }

  async function addVendor(payload: VendorCreatePayload) {
    await createVendor(payload);
    await loadVendors();
  }

  async function editVendor(id: string, payload: VendorUpdatePayload) {
    await updateVendor(id, payload);
    await loadVendors();
  }

  async function removeVendor(id: string) {
    await deleteVendor(id);
    await loadVendors();
  }

  return {
    vendors,
    total,
    totalPages,
    loading,
    error,
    params,
    setParams,
    addVendor,
    editVendor,
    removeVendor,
    updateVendorStatus,
    refetch: loadVendors
  };
}
