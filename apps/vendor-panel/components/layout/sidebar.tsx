"use client";

import Link from "next/link";
import { ChevronRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "@/constants/routes";

interface SidebarProps {
  pathname: string;
  className?: string;
  onNavigate?: () => void;
  iconMap: Record<string, React.ComponentType<{ className?: string }>>;
}

export function Sidebar({ pathname, className, onNavigate, iconMap }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed z-30 h-full w-72 border-r border-[color:var(--line)] bg-[color:var(--panel)] text-slate-100",
        className
      )}
    >
      <div className="border-b border-white/10 px-5 py-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/80">
          <Store className="h-3.5 w-3.5" />
          Vendor Panel
        </div>
        <p className="mt-3 text-xl font-semibold text-white">MySupporttaShop</p>
        <p className="mt-1 text-xs text-white/65">Run daily commerce operations and storefront management.</p>
      </div>

      <nav className="space-y-5 p-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-2 text-xs uppercase tracking-[0.12em] text-white/50">{group.title}</p>
            {group.items.map((item) => {
              const Icon = iconMap[item.key];
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all",
                    isActive
                      ? "bg-[linear-gradient(135deg,#ff8a4d,#e85d2f)] text-white shadow-[0_10px_25px_rgba(232,93,47,.35)]"
                      : "text-white/80 hover:bg-white/10"
                  )}
                  onClick={onNavigate}
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
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
          <p className="font-medium text-white/90">Current workspace</p>
          <p className="mt-1 truncate">Vendor Operations</p>
        </div>
      </div>
    </aside>
  );
}
