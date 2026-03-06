import { Download, ReceiptText, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const invoices = [
  { no: "INV-1204", order: "ORD-1204", date: "06 Mar 2026", amount: "INR 1,499", status: "Sent" },
  { no: "INV-1203", order: "ORD-1203", date: "05 Mar 2026", amount: "INR 2,890", status: "Paid" },
  { no: "INV-1202", order: "ORD-1202", date: "05 Mar 2026", amount: "INR 999", status: "Pending" }
];

export default function InvoicePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Invoice"
        description="Generate, send, and reconcile invoices with order-level traceability."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <ReceiptText className="h-4 w-4" />
              New Invoice
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Issued This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">86</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-amber-700">INR 42,100</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-emerald-700">INR 3,21,560</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto rounded-xl border border-[color:var(--line)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Invoice</th>
                <th className="py-2">Order</th>
                <th className="py-2">Date</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.no} className="border-t border-[color:var(--line)]">
                  <td className="py-2 font-medium text-slate-900">{invoice.no}</td>
                  <td className="py-2 text-slate-600">{invoice.order}</td>
                  <td className="py-2 text-slate-600">{invoice.date}</td>
                  <td className="py-2 text-slate-600">{invoice.amount}</td>
                  <td className="py-2 text-slate-600">{invoice.status}</td>
                  <td className="py-2">
                    <Button variant="ghost" className="gap-1 px-2 py-1 text-xs">
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
