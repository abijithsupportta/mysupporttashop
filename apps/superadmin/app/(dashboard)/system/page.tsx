"use client";

import { Activity, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSystemHealth } from "@/hooks/use-system-health";

export default function SystemPage() {
  const { health, loading, error, refetch } = useSystemHealth();

  if (loading) {
    return <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6">Checking system health...</div>;
  }

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <Card className="border-[color:var(--line)] shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Platform Health
          </CardTitle>
          <Button variant="outline" onClick={() => void refetch()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Stat label="Status" value={health?.status ?? "unknown"} icon={<Activity className="h-4 w-4" />} />
          <Stat label="Version" value={health?.version ?? "-"} />
          <Stat label="Environment" value={health?.environment ?? "-"} />
        </CardContent>
      </Card>

      <Card className="border-[color:var(--line)] shadow-none">
        <CardHeader>
          <CardTitle>Operations Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>- Confirm `/api/v1/health` returns `healthy`.</li>
            <li>- Verify Supabase credentials and service role key are configured.</li>
            <li>- Validate Resend credentials before onboarding vendors.</li>
            <li>- Review audit trail events for sensitive changes.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--panel-muted)] p-4">
      <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
