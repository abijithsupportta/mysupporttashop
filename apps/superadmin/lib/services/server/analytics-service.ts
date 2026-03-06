import type { RevenuePoint, TopVendor } from "@/types/analytics";
import { toNumber } from "@/lib/utils/number";
import {
  getRevenueRows,
  getTopVendorsRows
} from "@/lib/repositories/analytics-repository";

function dayKey(isoDate: string) {
  return isoDate.slice(0, 10);
}

export async function getRevenueAnalyticsService(days: number): Promise<RevenuePoint[]> {
  const rows = await getRevenueRows(days);

  const grouped = new Map<string, RevenuePoint>();

  for (const row of rows) {
    const key = dayKey(row.created_at);
    const existing = grouped.get(key) ?? {
      date: key,
      revenue: 0,
      commission: 0,
      orders: 0
    };

    existing.revenue += toNumber(row.total);
    existing.commission += toNumber(row.commission);
    existing.orders += 1;
    grouped.set(key, existing);
  }

  return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getTopVendorsService(limit: number): Promise<TopVendor[]> {
  const { rows } = await getTopVendorsRows(limit);
  const grouped = new Map<string, TopVendor>();

  for (const row of rows as Array<{
    vendor_id: string;
    total: number | string;
    commission: number | string;
    profiles?: Array<{ full_name?: string; email?: string }> | { full_name?: string; email?: string } | null;
  }>) {
    const vendorId = row.vendor_id;
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    const existing = grouped.get(vendorId) ?? {
      vendor_id: vendorId,
      vendor_name: profile?.full_name ?? "Unknown Vendor",
      vendor_email: profile?.email ?? "",
      total_revenue: 0,
      total_commission: 0,
      total_orders: 0
    };

    existing.total_revenue += toNumber(row.total);
    existing.total_commission += toNumber(row.commission);
    existing.total_orders += 1;
    grouped.set(vendorId, existing);
  }

  return Array.from(grouped.values())
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, Math.max(1, limit));
}
