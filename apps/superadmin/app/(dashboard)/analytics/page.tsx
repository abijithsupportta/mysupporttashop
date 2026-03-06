"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-analytics";
import { formatINR } from "@/lib/format";

export default function AnalyticsPage() {
  const { revenue, vendors, loading, error } = useAnalytics(30, 8);

  const totalRevenue = revenue.reduce((sum, point) => sum + point.revenue, 0);
  const totalCommission = revenue.reduce((sum, point) => sum + point.commission, 0);
  const totalOrders = revenue.reduce((sum, point) => sum + point.orders, 0);

  if (loading) {
    return <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6">Loading analytics...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric title="30D Revenue" value={formatINR(totalRevenue)} />
        <Metric title="30D Commission" value={formatINR(totalCommission)} />
        <Metric title="30D Orders" value={String(totalOrders)} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-[color:var(--line)] shadow-none">
          <CardHeader>
            <CardTitle>Revenue Trend (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="4 4" stroke="#d9d9d9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatINR(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#e85d2f" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="commission" stroke="#0f766e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-[color:var(--line)] shadow-none">
          <CardHeader>
            <CardTitle>Top Vendors by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendors} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#d9d9d9" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="vendor_name" tick={{ fontSize: 12 }} width={130} />
                <Tooltip formatter={(value: number) => formatINR(value)} />
                <Bar dataKey="total_revenue" fill="#e85d2f" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-[color:var(--line)] shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
