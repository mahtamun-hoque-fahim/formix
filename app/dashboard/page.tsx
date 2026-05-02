import { requireAuth } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { forms, formSubmissions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { FileText, Send, BarChart2, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const userId = await requireAuth();
  const db = getDb();

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, userId))
    .orderBy(desc(forms.createdAt));

  const [submissionStat] = await db
    .select({ count: count() })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .where(eq(forms.userId, userId));

  // Recent submissions across all forms
  const recentSubmissions = await db
    .select({
      id: formSubmissions.id,
      formId: formSubmissions.formId,
      submittedAt: formSubmissions.submittedAt,
      respondentEmail: formSubmissions.respondentEmail,
    })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .where(eq(forms.userId, userId))
    .orderBy(desc(formSubmissions.submittedAt))
    .limit(5);

  // Build formId → title map for recent submissions
  const formMap = Object.fromEntries(userForms.map((f) => [f.id, f.title]));

  const publishedCount = userForms.filter((f) => f.status === "published").length;
  const totalResponses = Number(submissionStat?.count ?? 0);

  const stats = [
    { label: "Total Forms", value: userForms.length, icon: FileText, href: "/dashboard/forms" },
    { label: "Published", value: publishedCount, icon: BarChart2, href: "/dashboard/forms" },
    { label: "Total Responses", value: totalResponses, icon: Send, href: "/dashboard/forms" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>
            Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Your forms and responses at a glance
          </p>
        </div>
        <Link
          href="/dashboard/forms/new"
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={15} />
          New Form
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-md p-5 transition-colors block"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </span>
              <stat.icon size={16} style={{ color: "var(--accent)" }} />
            </div>
            <span className="text-3xl font-bold font-syne" style={{ color: "var(--text)" }}>
              {stat.value.toLocaleString()}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Recent forms — 3 cols */}
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold font-syne" style={{ color: "var(--text)" }}>
              Recent Forms
            </h2>
            <Link
              href="/dashboard/forms"
              className="text-xs transition-colors"
              style={{ color: "var(--accent)" }}
            >
              View all →
            </Link>
          </div>

          {userForms.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-md"
              style={{ border: "1px dashed var(--border)" }}
            >
              <FileText size={28} style={{ color: "var(--text-disabled)" }} className="mb-3" />
              <p className="font-medium mb-1 text-sm" style={{ color: "var(--text)" }}>
                No forms yet
              </p>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                Create your first form to start collecting responses
              </p>
              <Link
                href="/dashboard/forms/new"
                className="px-4 py-2 rounded text-sm font-medium text-white"
                style={{ background: "var(--accent)" }}
              >
                Create Form
              </Link>
            </div>
          ) : (
            <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
                  >
                    <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      Form
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      Status
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      Created
                    </th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {userForms.slice(0, 6).map((form) => (
                    <tr key={form.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium truncate max-w-[180px]" style={{ color: "var(--text)" }}>
                          {form.title}
                        </p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                          /f/{form.slug}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={form.status as "draft" | "published" | "closed"} />
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {formatDate(form.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/dashboard/forms/${form.id}/responses`}
                            className="text-xs px-2.5 py-1 rounded transition-colors"
                            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
                          >
                            Responses
                          </Link>
                          <Link
                            href={`/dashboard/forms/${form.id}`}
                            className="text-xs px-2.5 py-1 rounded transition-colors"
                            style={{ color: "var(--accent)", background: "var(--accent-dim)" }}
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent activity — 2 cols */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} style={{ color: "var(--accent)" }} />
            <h2 className="text-base font-semibold font-syne" style={{ color: "var(--text)" }}>
              Recent Responses
            </h2>
          </div>

          {recentSubmissions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 rounded-md"
              style={{ border: "1px dashed var(--border)" }}
            >
              <Send size={24} style={{ color: "var(--text-disabled)" }} className="mb-2" />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                No responses yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/dashboard/forms/${sub.formId}/responses`}
                  className="flex flex-col gap-0.5 rounded-md px-4 py-3 transition-colors"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                    {formMap[sub.formId] ?? "Unknown form"}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {sub.respondentEmail ?? "Anonymous"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
                      {formatDateTime(sub.submittedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
