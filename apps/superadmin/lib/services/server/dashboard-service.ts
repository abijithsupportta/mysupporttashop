import type { DashboardStats } from "@/types/dashboard";
import { getDashboardCounts } from "@/lib/repositories/dashboard-repository";
import {
  toDashboardRecentOrders,
  toDashboardRecentVendors,
  toDashboardTotals
} from "@/lib/transformers/dashboard";

export async function getDashboardStatsService(): Promise<DashboardStats> {
  const result = await getDashboardCounts();
  const totals = toDashboardTotals(result.paidRows);

  return {
    total_vendors: result.totalVendorsCount,
    total_orders: result.totalOrdersCount,
    total_revenue: totals.totalRevenue,
    total_commission: totals.totalCommission,
    new_vendors_this_month: result.newVendorsThisMonthCount,
    new_orders_today: result.newOrdersTodayCount,
    pending_orders: result.pendingOrdersCount,
    active_vendors: result.activeVendorsCount,
    recent_orders: toDashboardRecentOrders(result.recentOrderRows),
    recent_vendors: toDashboardRecentVendors(result.recentVendorRows)
  };
}
