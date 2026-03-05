"use client";

import {
  CheckCircle,
  Clock,
  Package,
  Percent,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { VendorStatusBadge } from "@/components/vendors/vendor-status-badge";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatDateDDMMYYYY, formatINR } from "@/lib/format";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function DashboardPage() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error || "Failed to load dashboard"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Vendors" value={String(stats.total_vendors)} color="blue" icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Total Orders" value={String(stats.total_orders)} color="purple" icon={<ShoppingBag className="h-5 w-5" />} />
        <StatsCard title="Total Revenue" value={formatINR(stats.total_revenue)} color="green" icon={<TrendingUp className="h-5 w-5" />} />
        <StatsCard title="Total Commission" value={formatINR(stats.total_commission)} color="orange" icon={<Percent className="h-5 w-5" />} />
        <StatsCard title="New Vendors This Month" value={String(stats.new_vendors_this_month)} color="blue" icon={<UserPlus className="h-5 w-5" />} />
        <StatsCard title="New Orders Today" value={String(stats.new_orders_today)} color="purple" icon={<Package className="h-5 w-5" />} />
        <StatsCard title="Pending Orders" value={String(stats.pending_orders)} color="yellow" icon={<Clock className="h-5 w-5" />} />
        <StatsCard title="Active Vendors" value={String(stats.active_vendors)} color="green" icon={<CheckCircle className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-2 text-left">Order</th>
                  <th className="pb-2 text-left">Vendor</th>
                  <th className="pb-2 text-left">Customer</th>
                  <th className="pb-2 text-left">Amount</th>
                  <th className="pb-2 text-left">Commission</th>
                  <th className="pb-2 text-left">Status</th>
                  <th className="pb-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-t border-[#f0f0f0]">
                    <td className="py-2">{order.id.slice(0, 8)}</td>
                    <td className="py-2">{order.store?.name ?? "-"}</td>
                    <td className="py-2">{order.customer_name}</td>
                    <td className="py-2">{formatINR(order.total)}</td>
                    <td className="py-2">{formatINR(order.commission)}</td>
                    <td className="py-2"><OrderStatusBadge status={order.order_status} /></td>
                    <td className="py-2">{formatDateDDMMYYYY(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Vendors</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-2 text-left">Name</th>
                  <th className="pb-2 text-left">Store</th>
                  <th className="pb-2 text-left">Email</th>
                  <th className="pb-2 text-left">Status</th>
                  <th className="pb-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-[#f0f0f0]">
                    <td className="py-2">{vendor.full_name}</td>
                    <td className="py-2">{vendor.store?.name ?? "-"}</td>
                    <td className="py-2">{vendor.email}</td>
                    <td className="py-2"><VendorStatusBadge is_active={vendor.is_active} /></td>
                    <td className="py-2">{formatDateDDMMYYYY(vendor.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
