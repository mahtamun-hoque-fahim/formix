import { requireAdmin } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { users, forms, formSubmissions } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { Users, FileText, Send, Shield } from "lucide-react";

export const metadata = { title: "Admin Panel" };

export default async function AdminPage() {
  await requireAdmin();
  const db = getDb();

  const [userCount] = await db.select({ count: count() }).from(users);
  const [formCount] = await db.select({ count: count() }).from(forms);
  const [submissionCount] = await db.select({ count: count() }).from(formSubmissions);

  const stats = [
    { label: "Total Users", value: userCount?.count ?? 0, icon: Users },
    { label: "Total Forms", value: formCount?.count ?? 0, icon: FileText },
    { label: "Total Responses", value: submissionCount?.count ?? 0, icon: Send },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield size={20} style={{ color: "var(--accent)" }} />
        <div>
          <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>
            Admin Panel
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Platform-wide overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{stat.label}</span>
              <stat.icon size={16} style={{ color: "var(--accent)" }} />
            </div>
            <span className="text-3xl font-bold font-syne" style={{ color: "var(--text)" }}>
              {Number(stat.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div
        className="rounded-md p-6 text-center"
        style={{ border: "1px dashed var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Full user management, form audit, and platform controls — coming in Phase 6
        </p>
      </div>
    </div>
  );
}
