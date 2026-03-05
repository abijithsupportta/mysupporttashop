"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useVendors } from "@/hooks/use-vendors";
import { formatINR } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

const OrdersTable = lazy(async () => {
  const tableModule = await import("@/components/orders/orders-table");
  return { default: tableModule.OrdersTable };
});

export default function OrdersPage() {
  const { vendors } = useVendors({ page: 1, limit: 100, status: "all" });
  const { orders, total, totalPages, summary, loading, error, params, setParams } = useOrders({
    page: 1,
    limit: 10
  });

  const [searchInput, setSearchInput] = useState(params.search);
  const debouncedSearch = useDebouncedValue(searchInput, 500);

  useEffect(() => {
    setParams((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, setParams]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Summary label="Total Orders" value={String(total)} />
        <Summary label="Total Revenue" value={formatINR(summary.total_revenue)} />
        <Summary label="Total Commission" value={formatINR(summary.total_commission)} />
      </div>

      <div className="rounded-xl border border-[#e5e5e5] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Input
            placeholder="Search order/customer"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="xl:col-span-2"
          />

          <select
            className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
            value={params.order_status}
            onChange={(event) =>
              setParams((prev) => ({
                ...prev,
                page: 1,
                order_status: event.target.value as typeof prev.order_status
              }))
            }
          >
            <option value="all">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
            value={params.payment_status}
            onChange={(event) =>
              setParams((prev) => ({
                ...prev,
                page: 1,
                payment_status: event.target.value as typeof prev.payment_status
              }))
            }
          >
            <option value="all">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            className="h-10 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm"
            value={params.vendor_id}
            onChange={(event) =>
              setParams((prev) => ({ ...prev, page: 1, vendor_id: event.target.value }))
            }
          >
            <option value="all">All Vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.full_name}
              </option>
            ))}
          </select>

          <Input
            type="date"
            value={params.from_date}
            onChange={(event) =>
              setParams((prev) => ({ ...prev, page: 1, from_date: event.target.value }))
            }
          />
          <Input
            type="date"
            value={params.to_date}
            onChange={(event) =>
              setParams((prev) => ({ ...prev, page: 1, to_date: event.target.value }))
            }
          />
        </div>

        <Button
          variant="outline"
          className="mt-3"
          onClick={() => {
            setSearchInput("");
            setParams((prev) => ({
              ...prev,
              page: 1,
              search: "",
              order_status: "all",
              payment_status: "all",
              vendor_id: "all",
              from_date: "",
              to_date: ""
            }));
          }}
        >
          Clear filters
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Suspense fallback={<Skeleton className="h-96" />}>
        <OrdersTable
          data={orders}
          loading={loading}
          page={params.page}
          totalPages={totalPages}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        />
      </Suspense>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
