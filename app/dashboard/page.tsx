import { requireAuth } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { forms, formSubmissions } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { FileText, Send, BarChart2, Plus } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const userId = await requireAuth();
  const db = getDb();

  const userForms = await db.select().from(forms)
    .where(eq(forms.userId, userId))
    .orderBy(forms.createdAt);

  const [submissionCount] = await db.select({ count: count() })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .where(eq(forms.userId, userId));

  const publishedCount = userForms.filter(f => f.status === "published").length;

  const stats = [
    { label: "Total Forms", value: userForms.length, icon: FileText },
    { label: "Published", value: publishedCount, icon: BarChart2 },
    { label: "Responses", value: submissionCount?.count ?? 0, icon: Send },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>Overview</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Your forms and responses at a glance</p>
        </div>
        <Link href="/dashboard/forms/new"
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-colors"
          style={{ background: "var(--accent)" }}>
          <Plus size={16} />
          New Form
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{stat.label}</span>
              <stat.icon size={16} style={{ color: "var(--accent)" }} />
            </div>
            <span className="text-3xl font-bold font-syne" style={{ color: "var(--text)" }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Recent forms */}
      <div>
        <h2 className="text-base font-semibold font-syne mb-4" style={{ color: "var(--text)" }}>
          Recent Forms
        </h2>
        {userForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-md"
            style={{ border: "1px dashed var(--border)" }}>
            <FileText size={32} style={{ color: "var(--text-disabled)" }} className="mb-3" />
            <p className="font-medium mb-1" style={{ color: "var(--text)" }}>No forms yet</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Create your first form to start collecting responses</p>
            <Link href="/dashboard/forms/new"
              className="px-4 py-2 rounded text-sm font-medium text-white"
              style={{ background: "var(--accent)" }}>
              Create Form
            </Link>
          </div>
        ) : (
          <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                  <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Form</th>
                  <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {userForms.slice(0, 5).map((form) => (
                  <tr key={form.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium" style={{ color: "var(--text)" }}>{form.title}</p>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
                          /f/{form.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={form.status as "draft" | "published" | "closed"} />
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {formatDate(form.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/forms/${form.id}`}
                        className="text-xs px-3 py-1 rounded transition-colors"
                        style={{ color: "var(--accent)", background: "var(--accent-dim)" }}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
