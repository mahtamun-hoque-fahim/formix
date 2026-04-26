import { requireAuth } from "@/lib/clerk";
import { getRole } from "@/lib/clerk";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  const role = await getRole();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar role={role ?? "user"} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
