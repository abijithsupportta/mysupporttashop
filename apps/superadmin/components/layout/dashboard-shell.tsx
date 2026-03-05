"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/services/client/auth-service";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/orders", label: "Orders", icon: ShoppingBag }
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
    if (pathname.startsWith("/vendors")) return "Vendors";
    if (pathname.startsWith("/orders")) return "Orders";
    return "Dashboard";
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <aside
        className={`fixed z-30 h-full w-64 bg-[#0f0f0f] text-white transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-4 text-lg font-semibold">
          MySupportaShop
        </div>

        <nav className="p-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? "bg-[#e85d2f] text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 w-full px-3">
          <Button
            className="w-full justify-start bg-white/10 text-white hover:bg-white/20"
            onClick={() => void logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e5e5e5] bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded border border-[#e5e5e5] p-2 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-semibold text-[#0f0f0f]">{title}</h1>
          </div>
          <p className="text-sm text-gray-600">{adminEmail}</p>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
