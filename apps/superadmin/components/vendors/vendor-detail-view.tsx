"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorStatusBadge } from "@/components/vendors/vendor-status-badge";
import { SuspendDialog } from "@/components/vendors/suspend-dialog";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatDateDDMMYYYY, formatINR } from "@/lib/format";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useVendorDetail } from "@/hooks/use-vendor-detail";

export function VendorDetailView({ vendorId }: { vendorId: string }) {
  const { page, setPage, detail, loading, error, toggleStatus } = useVendorDetail({
    vendorId,
    initialPage: 1,
    pageSize: 10
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !detail) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error || "Vendor not found"}
      </div>
    );
  }

  const { vendor, products, orders, orders_total_pages } = detail;

  return (
    <div className="space-y-4">
      <Link href="/vendors" className="inline-flex items-center text-sm text-[#e85d2f]">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Vendors
      </Link>

      <Card>
        <CardContent className="flex flex-col justify-between gap-4 p-4 md:flex-row">
          <div>
            <p className="text-lg font-semibold">{vendor.full_name}</p>
            <p className="text-sm text-gray-600">{vendor.email}</p>
            <p className="text-sm text-gray-600">{vendor.phone}</p>
            <p className="text-xs text-gray-500">
              Joined: {formatDateDDMMYYYY(vendor.created_at)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Products" value={String(vendor.total_products ?? 0)} />
            <Stat label="Orders" value={String(vendor.total_orders ?? 0)} />
            <Stat label="Revenue" value={formatINR(vendor.total_revenue ?? 0)} />
            <Stat label="Commission" value={formatINR(vendor.commission_earned ?? 0)} />
          </div>
          <div className="flex items-start gap-2">
            <VendorStatusBadge is_active={vendor.is_active} />
            <Button
              variant={vendor.is_active ? "destructive" : "default"}
              onClick={() => setDialogOpen(true)}
            >
              {vendor.is_active ? "Suspend" : "Activate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-2">
          <p>Store: {vendor.store?.name ?? "-"}</p>
          <p>
            URL: {vendor.store?.slug ? `mysupportashop.com/store/${vendor.store.slug}` : "-"}
          </p>
          <p>Status: {vendor.store?.status ?? "-"}</p>
          <p>Published: {vendor.store?.is_published ? "Yes" : "No"}</p>
          <p>
            Created: {vendor.store?.created_at ? formatDateDDMMYYYY(vendor.store.created_at) : "-"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="pb-2 text-left">Name</th>
                <th className="pb-2 text-left">Price</th>
                <th className="pb-2 text-left">Stock</th>
                <th className="pb-2 text-left">Status</th>
                <th className="pb-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[#f0f0f0]">
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">{formatINR(product.price)}</td>
                  <td className="py-2">{product.stock}</td>
                  <td className="py-2">{product.status}</td>
                  <td className="py-2">{formatDateDDMMYYYY(product.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link href="/orders" className="mt-3 inline-flex text-sm text-[#e85d2f]">
            View all products
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="pb-2 text-left">Order</th>
                <th className="pb-2 text-left">Customer</th>
                <th className="pb-2 text-left">Amount</th>
                <th className="pb-2 text-left">Commission</th>
                <th className="pb-2 text-left">Payment</th>
                <th className="pb-2 text-left">Order</th>
                <th className="pb-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#f0f0f0]">
                  <td className="py-2">{order.id.slice(0, 8)}</td>
                  <td className="py-2">{order.customer_name}</td>
                  <td className="py-2">{formatINR(order.total)}</td>
                  <td className="py-2">{formatINR(order.commission)}</td>
                  <td className="py-2"><OrderStatusBadge status={order.payment_status} /></td>
                  <td className="py-2"><OrderStatusBadge status={order.order_status} /></td>
                  <td className="py-2">{formatDateDDMMYYYY(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= orders_total_pages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <SuspendDialog
        open={dialogOpen}
        vendorName={vendor.full_name}
        action={vendor.is_active ? "suspend" : "activate"}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => {
          void toggleStatus().finally(() => {
            setDialogOpen(false);
          });
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e5e5e5] p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
