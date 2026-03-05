import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getUser } from "@/lib/auth/session";

const defaultSuperadminEmail =
  process.env.SUPERADMIN_EMAIL ?? "info@supporttasolutions.com";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const current = await getUser();
  const allowByEmail =
    current?.user.email?.toLowerCase() === defaultSuperadminEmail.toLowerCase();

  if (!current?.user || (current.profile?.role !== "superadmin" && !allowByEmail)) {
    redirect("/login");
  }

  return (
    <DashboardShell adminEmail={current.user.email ?? "admin"}>
      {children}
    </DashboardShell>
  );
}
