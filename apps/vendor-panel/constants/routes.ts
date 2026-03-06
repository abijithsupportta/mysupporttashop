export const ROUTES = {
  dashboard: "/dashboard",
  inventory: "/inventory",
  orders: "/orders",
  invoices: "/invoice",
  analytics: "/analytics",
  storeSettings: "/store/settings",
  storeBranding: "/store/branding"
} as const;

export const NAV_GROUPS = [
  {
    title: "Operations",
    items: [
      { href: ROUTES.dashboard, label: "Dashboard", key: "dashboard" },
      { href: ROUTES.inventory, label: "Inventory", key: "inventory" },
      { href: ROUTES.orders, label: "Orders", key: "orders" },
      { href: ROUTES.invoices, label: "Invoice", key: "invoice" }
    ]
  },
  {
    title: "Storefront",
    items: [
      { href: ROUTES.storeSettings, label: "Store Settings", key: "store-settings" },
      { href: ROUTES.storeBranding, label: "Banner Section", key: "banner" }
    ]
  }
] as const;

export function getPageTitle(pathname: string) {
  if (pathname.startsWith(ROUTES.inventory) || pathname.startsWith("/products")) return "Inventory";
  if (pathname.startsWith(ROUTES.orders)) return "Orders";
  if (pathname.startsWith(ROUTES.invoices)) return "Invoice";
  if (pathname.startsWith(ROUTES.storeSettings)) return "Store Settings";
  if (pathname.startsWith(ROUTES.storeBranding)) return "Banner Section";
  return "Dashboard";
}

