import { IndianRupee, PackageSearch, ShoppingCart, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpis = [
  { label: "Today's Orders", value: "34", icon: ShoppingCart },
  { label: "Revenue Today", value: "INR 48,600", icon: IndianRupee },
  { label: "Low Stock Alerts", value: "8", icon: PackageSearch },
  { label: "Orders In Transit", value: "21", icon: Truck }
];

const timeline = [
  { event: "Order #ORD-2028 moved to shipped", time: "2 mins ago" },
  { event: "Banner campaign updated for weekend sale", time: "19 mins ago" },
  { event: "Stock synced for 14 SKUs", time: "43 mins ago" },
  { event: "Invoice INV-1204 generated", time: "1 hour ago" }
];

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendor Dashboard"
        description="Monitor store health, order flow, and revenue trends in real time."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{item.label}</CardTitle>
                <Icon className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Fulfillment Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto rounded-xl border border-[color:var(--line)] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ORD-1204", "Rahul K", "INR 1,499", "Processing"],
                  ["ORD-1203", "Anita P", "INR 2,890", "Packed"],
                  ["ORD-1202", "Gowri M", "INR 999", "Shipped"]
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-[color:var(--line)]">
                    <td className="py-2 font-medium text-slate-900">{row[0]}</td>
                    <td className="py-2 text-slate-600">{row[1]}</td>
                    <td className="py-2 text-slate-600">{row[2]}</td>
                    <td className="py-2 text-slate-600">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {timeline.map((item) => (
                <li key={item.event} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel-muted)] p-3">
                  <p className="text-sm font-medium text-slate-900">{item.event}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

