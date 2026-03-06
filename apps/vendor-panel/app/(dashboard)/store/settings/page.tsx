import { CreditCard, Package, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StoreSettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Store Settings"
        description="Configure operational preferences, dispatch flow, and payout readiness."
        actions={<Button>Save Changes</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Store Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <Field label="Store Name" value="Chennai Foods" />
            <Field label="Support Email" value="vendor@example.com" />
            <Field label="Contact Number" value="+91 98765 43210" />
            <Field label="Address" value="12 Gandhi Road, Chennai" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <Tile icon={<Package className="h-4 w-4" />} title="Packaging SLA" value="24 hours" />
            <Tile icon={<Truck className="h-4 w-4" />} title="Shipping Mode" value="Hyperlocal + Standard" />
            <Tile icon={<CreditCard className="h-4 w-4" />} title="Payout Cycle" value="Every Friday" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel-muted)] p-3">
      <p className="text-xs uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}

function Tile({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[color:var(--line)] bg-[color:var(--panel-muted)] p-3">
      <p className="inline-flex items-center gap-2 font-medium text-slate-900">
        {icon}
        {title}
      </p>
      <p className="text-slate-600">{value}</p>
    </div>
  );
}

