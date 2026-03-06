"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Activity,
  Boxes,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Menu,
  PackageCheck,
  ShoppingCart,
  Store,
  StoreIcon
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";
import { getPageTitle, ROUTES } from "@/constants/routes";

const iconMap = {
  dashboard: LayoutDashboard,
  inventory: Boxes,
  orders: ShoppingCart,
  invoice: FileText,
  "store-settings": Store,
  banner: StoreIcon
} as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = getPageTitle(pathname);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_10%_0%,#fff5ec,transparent_38%),radial-gradient(circle_at_90%_100%,#e5f7f8,transparent_42%),#f5f7fb]">
      <Sidebar
        pathname={pathname}
        iconMap={iconMap}
        className="hidden md:block"
      />

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Sidebar pathname={pathname} iconMap={iconMap} onNavigate={() => setMobileOpen(false)} />
      </MobileNav>

      <div className="min-w-0 flex-1 md:ml-72">
        <Navbar
          title={title}
          subtitle="Control inventory, orders, invoices and storefront operations."
          leading={
            <button
              className="rounded border border-[color:var(--line)] p-2 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          }
          trailing={
            <div className="hidden items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs text-slate-600 md:inline-flex">
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              Vendor Operations Live
            </div>
          }
        />

        <main className="space-y-6 p-4 md:p-6">
          <section className="rounded-2xl border border-[color:var(--line)] bg-[linear-gradient(130deg,#0f172a_0%,#1e293b_38%,#334155_100%)] p-6 text-white shadow-[0_20px_45px_rgba(15,23,42,.28)]">
            <p className="text-xs uppercase tracking-[0.14em] text-white/70">Vendor Mission Control</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Performance and Store Operations</h2>
            <p className="mt-2 text-sm text-white/80">
              Keep inventory healthy, process orders faster, and publish storefront updates from one control panel.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={ROUTES.inventory} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25">
                <PackageCheck className="h-4 w-4" />
                Open Inventory
              </Link>
              <Link href={ROUTES.storeBranding} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25">
                <StoreIcon className="h-4 w-4" />
                Edit Banner Section
              </Link>
            </div>
          </section>
          {children}
        </main>
      </div>
    </div>
  );
}
