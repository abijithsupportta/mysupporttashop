import { Filter, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
  { id: "ORD-1204", customer: "Rahul K", amount: "INR 1,499", payment: "Paid", status: "Processing" },
  { id: "ORD-1203", customer: "Anita P", amount: "INR 2,890", payment: "Paid", status: "Packed" },
  { id: "ORD-1202", customer: "Gowri M", amount: "INR 999", payment: "Pending", status: "Pending" },
  { id: "ORD-1201", customer: "Vikram S", amount: "INR 3,450", payment: "Paid", status: "Shipped" }
];

export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        description="Prioritize fulfillment, monitor payment status, and reduce dispatch delays."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Bulk Update
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-amber-700">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">21</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Shipped Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-emerald-700">9</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Queue</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto rounded-xl border border-[color:var(--line)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[color:var(--line)]">
                  <td className="py-2 font-medium text-slate-900">{order.id}</td>
                  <td className="py-2 text-slate-600">{order.customer}</td>
                  <td className="py-2 text-slate-600">{order.amount}</td>
                  <td className="py-2 text-slate-600">{order.payment}</td>
                  <td className="py-2 text-slate-600">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

