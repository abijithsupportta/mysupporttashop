import { ImagePlus, Palette, Save } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BrandingPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Banner Section"
        description="Design your storefront hero with campaign text, visual assets, and CTA highlights."
        actions={
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Publish Banner
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Banner Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <EditableField label="Headline" value="Weekend Combo Sale up to 30%" />
            <EditableField label="Subtext" value="Limited time bundles crafted for quick checkout." />
            <EditableField label="Primary CTA" value="Shop Fresh Deals" />
            <EditableField label="Secondary CTA" value="Browse Best Sellers" />
            <div className="flex items-center gap-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--panel-muted)] p-3">
              <Palette className="h-4 w-4 text-slate-500" />
              <span className="text-slate-700">Theme Accent:</span>
              <span className="rounded bg-slate-900 px-2 py-0.5 text-xs text-white">#e85d2f</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banner Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[linear-gradient(130deg,#0f172a_0%,#1e293b_45%,#334155_100%)] p-6 text-white">
              <p className="text-xs uppercase tracking-[0.12em] text-white/70">Featured Campaign</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Weekend Combo Sale up to 30%</h3>
              <p className="mt-2 text-sm text-white/80">
                Limited time bundles crafted for quick checkout and repeat buyers.
              </p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-full bg-white/20 px-3 py-1.5 text-sm">Shop Fresh Deals</button>
                <button className="rounded-full border border-white/30 px-3 py-1.5 text-sm">Browse Best Sellers</button>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-[color:var(--line)] bg-white p-4 text-center text-sm text-slate-600">
              <ImagePlus className="mx-auto mb-2 h-5 w-5" />
              Drag and drop banner image (recommended: 1600 x 600)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EditableField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel-muted)] p-3">
      <p className="text-xs uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}

