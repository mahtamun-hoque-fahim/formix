import { requireAuth } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { forms, formSubmissions } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "My Forms" };

export default async function FormsPage() {
  const userId = await requireAuth();
  const db = getDb();

  const userForms = await db.select().from(forms)
    .where(eq(forms.userId, userId))
    .orderBy(forms.createdAt);

  // Get submission counts per form
  const submissionCounts = await db
    .select({ formId: formSubmissions.formId, count: count() })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .where(eq(forms.userId, userId))
    .groupBy(formSubmissions.formId);

  const countMap = Object.fromEntries(submissionCounts.map((r) => [r.formId, Number(r.count)]));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>My Forms</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {userForms.length} form{userForms.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/forms/new"
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-colors"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={16} />
          New Form
        </Link>
      </div>

      {userForms.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-md"
          style={{ border: "1px dashed var(--border)" }}
        >
          <FileText size={36} style={{ color: "var(--text-disabled)" }} className="mb-3" />
          <p className="font-medium mb-1" style={{ color: "var(--text)" }}>No forms yet</p>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
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
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Form
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Responses
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Created
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {userForms.map((form) => (
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
                    {countMap[form.id] ?? 0}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatDate(form.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/dashboard/forms/${form.id}/responses`}
                        className="text-xs px-3 py-1 rounded transition-colors"
                        style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
                      >
                        Responses
                      </Link>
                      <Link
                        href={`/dashboard/forms/${form.id}`}
                        className="text-xs px-3 py-1 rounded transition-colors"
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
  );
}
