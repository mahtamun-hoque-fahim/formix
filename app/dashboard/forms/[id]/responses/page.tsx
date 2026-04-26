import { requireAuth } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { forms, formSubmissions, formFields, fieldResponses } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Responses" };

export default async function ResponsesPage({ params }: Props) {
  const userId = await requireAuth();
  const { id } = await params;
  const db = getDb();

  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));
  if (!form) notFound();

  const fields = await db.select().from(formFields)
    .where(eq(formFields.formId, id))
    .orderBy(formFields.order);

  const submissions = await db.select().from(formSubmissions)
    .where(eq(formSubmissions.formId, id))
    .orderBy(desc(formSubmissions.submittedAt));

  // Fetch all field responses for these submissions
  const submissionIds = submissions.map((s) => s.id);
  const allResponses = submissionIds.length > 0
    ? await db.select().from(fieldResponses)
        .where(eq(fieldResponses.submissionId, submissionIds[0]))
    : [];

  const visibleFields = fields.filter((f) => f.type !== "section_header" && f.type !== "divider");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/forms/${id}`}
            className="p-1.5 rounded transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>
              {form.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={form.status as "draft" | "published" | "closed"} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {submissions.length} response{submissions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {submissions.length > 0 && (
          <div className="flex items-center gap-2">
            <a
              href={`/api/export/${id}?format=csv`}
              className="text-sm px-3 py-1.5 rounded border transition-colors"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              CSV
            </a>
            <a
              href={`/api/export/${id}?format=xlsx`}
              className="text-sm px-3 py-1.5 rounded border transition-colors"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              Excel
            </a>
            <a
              href={`/api/export/${id}?format=json`}
              className="text-sm px-3 py-1.5 rounded border transition-colors"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              JSON
            </a>
            <a
              href={`/api/export/${id}?format=pdf`}
              className="text-sm px-3 py-1.5 rounded transition-colors"
              style={{ color: "white", background: "var(--accent)" }}
            >
              PDF
            </a>
          </div>
        )}
      </div>

      {submissions.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-md"
          style={{ border: "1px dashed var(--border)" }}
        >
          <p className="font-medium mb-1" style={{ color: "var(--text)" }}>No responses yet</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {form.status === "published"
              ? "Share the form link to start collecting responses."
              : "Publish your form to start collecting responses."}
          </p>
          {form.status === "published" && (
            <p className="mt-3 text-sm font-mono px-3 py-1.5 rounded"
              style={{ background: "var(--surface)", color: "var(--accent)", border: "1px solid var(--border)" }}>
              {process.env.NEXT_PUBLIC_APP_URL}/f/{form.slug}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-md overflow-auto" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <th className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  Submitted
                </th>
                {visibleFields.slice(0, 4).map((f) => (
                  <th key={f.id} className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr key={sub.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {submissions.length - i}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                    {formatDateTime(sub.submittedAt)}
                  </td>
                  {visibleFields.slice(0, 4).map((f) => (
                    <td key={f.id} className="px-4 py-3 text-xs max-w-[180px] truncate" style={{ color: "var(--text)" }}>
                      —
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      View
                    </span>
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
