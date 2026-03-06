"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelTop,
  Shield,
  ShoppingBag,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/services/client/auth-service";

const navGroups = [
  {
    title: "Overview",
    items: [{ href: "/dashboard", label: "Mission Control", icon: LayoutDashboard }]
  },
  {
    title: "Commerce",
    items: [
      { href: "/vendors", label: "Vendors", icon: Store },
      { href: "/orders", label: "Orders", icon: ShoppingBag }
    ]
  },
  {
    title: "Intelligence",
    items: [{ href: "/analytics", label: "Analytics", icon: BarChart3 }]
  },
  {
    title: "Platform",
    items: [{ href: "/system", label: "System Health", icon: Shield }]
  }
];

interface DashboardShellProps {
  children: React.ReactNode;
  adminEmail: string;
}

export function DashboardShell({ children, adminEmail }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await logoutUser();
    router.push("/login");
  }

  const title = useMemo(() => {
    if (pathname.startsWith("/analytics")) return "Analytics";
    if (pathname.startsWith("/system")) return "System Health";
    if (pathname.startsWith("/vendors")) return "Vendors";
    if (pathname.startsWith("/orders")) return "Orders";
    return "Mission Control";
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_10%_0%,#fff5ec,transparent_38%),radial-gradient(circle_at_90%_100%,#e5f7f8,transparent_42%),#f5f7fb]">
      <aside
        className={`fixed z-30 h-full w-72 border-r border-[color:var(--line)] bg-[color:var(--panel)] text-slate-100 transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/80">
            <PanelTop className="h-3.5 w-3.5" />
            Superadmin Console
          </div>
          <p className="mt-3 text-xl font-semibold text-white">MySupporttaShop</p>
          <p className="mt-1 text-xs text-white/65">Control plane for vendors, orders and platform operations.</p>
        </div>

        <nav className="space-y-5 p-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2 text-xs uppercase tracking-[0.12em] text-white/50">{group.title}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-[linear-gradient(135deg,#ff8a4d,#e85d2f)] text-white shadow-[0_10px_25px_rgba(232,93,47,.35)]"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {isActive ? <ChevronRight className="h-4 w-4" /> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
            <p className="font-medium text-white/90">Signed in as</p>
            <p className="mt-1 truncate">{adminEmail}</p>
          </div>
          <Button
            className="w-full justify-start bg-white/10 text-white hover:bg-white/20"
            onClick={() => void logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:ml-72">
        <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-white/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded border border-[color:var(--line)] p-2 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
              <p className="text-xs text-slate-500">Operational visibility with secure controls.</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs text-slate-600 md:inline-flex">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            Live Control Mode
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
