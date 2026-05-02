import { requireAdmin } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { forms, users, formSubmissions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Forms" };

export default async function AdminFormsPage() {
  await requireAdmin();
  const db = getDb();

  const allForms = await db
    .select({
      id: forms.id,
      title: forms.title,
      slug: forms.slug,
      status: forms.status,
      createdAt: forms.createdAt,
      userId: forms.userId,
      ownerEmail: users.email,
      ownerName: users.name,
    })
    .from(forms)
    .innerJoin(users, eq(forms.userId, users.id))
    .orderBy(desc(forms.createdAt));

  const subCounts = await db
    .select({ formId: formSubmissions.formId, count: count() })
    .from(formSubmissions)
    .groupBy(formSubmissions.formId);

  const subMap = Object.fromEntries(subCounts.map((r) => [r.formId, Number(r.count)]));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>
          All Forms
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {allForms.length} total form{allForms.length !== 1 ? "s" : ""} across all users
        </p>
      </div>

      <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
              {["Form", "Owner", "Status", "Responses", "Created", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap"
                  style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allForms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No forms yet.
                </td>
              </tr>
            ) : (
              allForms.map((form) => (
                <tr key={form.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm truncate max-w-[200px]" style={{ color: "var(--text)" }}>
                      {form.title}
                    </p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                      /f/{form.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs" style={{ color: "var(--text)" }}>{form.ownerName ?? "—"}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{form.ownerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={form.status as "draft" | "published" | "closed"} />
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {subMap[form.id] ?? 0}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                    {formatDate(form.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {form.status === "published" && (
                        <a
                          href={`${appUrl}/f/${form.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded transition-colors"
                          style={{ color: "var(--text-muted)" }}
                          title="View public form"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <Link
                        href={`/dashboard/forms/${form.id}/responses`}
                        className="text-xs px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                        style={{ color: "var(--accent)", background: "var(--accent-dim)" }}
                      >
                        Responses
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
