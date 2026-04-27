import { requireAuth } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { forms, formFields, formSubmissions, fieldResponses } from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
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

  const visibleFields = fields.filter(
    (f) => f.type !== "section_header" && f.type !== "divider"
  );

  const submissionIds = submissions.map((s) => s.id);
  const allResponses =
    submissionIds.length > 0
      ? await db.select().from(fieldResponses)
          .where(inArray(fieldResponses.submissionId, submissionIds))
      : [];

  const responseMap = new Map<string, Map<string, string>>();
  for (const r of allResponses) {
    if (!responseMap.has(r.submissionId)) responseMap.set(r.submissionId, new Map());
    responseMap.get(r.submissionId)!.set(r.fieldId, r.value ?? "");
  }

  const tableFields = visibleFields.slice(0, 5);
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/f/${form.slug}`;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/forms/${id}`} className="p-1.5 rounded transition-colors" style={{ color: "var(--text-muted)" }}>
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>{form.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={form.status as "draft" | "published" | "closed"} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {submissions.length} response{submissions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {submissions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            {(["csv", "json", "xlsx", "pdf"] as const).map((fmt) => (
              <a key={fmt} href={`/api/export/${id}?format=${fmt}`}
                className="text-xs px-3 py-1.5 rounded border uppercase font-mono transition-colors"
                style={{
                  color: fmt === "pdf" ? "white" : "var(--text-muted)",
                  borderColor: fmt === "pdf" ? "transparent" : "var(--border)",
                  background: fmt === "pdf" ? "var(--accent)" : "transparent",
                }}>
                {fmt}
              </a>
            ))}
          </div>
        )}
      </div>

      {form.status === "published" && submissions.length === 0 && (
        <div className="flex items-center gap-3 rounded-md px-4 py-3 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>Share link:</span>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm font-mono" style={{ color: "var(--accent)" }}>{publicUrl}</a>
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-md"
          style={{ border: "1px dashed var(--border)" }}>
          <p className="font-medium mb-1" style={{ color: "var(--text)" }}>No responses yet</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {form.status === "published"
              ? "Your form is live. Share the link to start collecting responses."
              : "Publish your form to start collecting responses."}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md overflow-auto" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                  <th className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: "var(--text-muted)" }}>#</th>
                  <th className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: "var(--text-muted)" }}>Submitted</th>
                  {tableFields.map((f) => (
                    <th key={f.id} className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap max-w-[160px] truncate" style={{ color: "var(--text-muted)" }}>
                      {f.label}
                    </th>
                  ))}
                  {visibleFields.length > 5 && (
                    <th className="px-4 py-3 text-xs font-medium text-right" style={{ color: "var(--text-disabled)" }}>
                      +{visibleFields.length - 5} more
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => {
                  const resMap = responseMap.get(sub.id) ?? new Map<string, string>();
                  return (
                    <tr key={sub.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{submissions.length - i}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{formatDateTime(sub.submittedAt)}</td>
                      {tableFields.map((f) => {
                        const raw = resMap.get(f.id) ?? "";
                        let display = raw;
                        try { const p = JSON.parse(raw); if (Array.isArray(p)) display = p.join(", "); } catch {}
                        return (
                          <td key={f.id} className="px-4 py-3 text-xs max-w-[160px] truncate"
                            style={{ color: display ? "var(--text)" : "var(--text-disabled)" }} title={display || "—"}>
                            {display || "—"}
                          </td>
                        );
                      })}
                      {visibleFields.length > 5 && <td className="px-4 py-3" />}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {visibleFields.length > 5 && (
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              Showing 5 of {visibleFields.length} fields. Export to see all columns.
            </p>
          )}
        </>
      )}
    </div>
  );
}
