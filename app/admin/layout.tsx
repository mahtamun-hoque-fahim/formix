import { requireAdmin } from "@/lib/auth-helpers";
import { getRole } from "@/lib/auth-helpers";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const role = await getRole();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar role={role ?? "admin"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
