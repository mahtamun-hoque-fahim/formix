"use client";
import { useState, useCallback } from "react";
import { FormField, FormSubmission, Form } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { SubmissionDrawer } from "./SubmissionDrawer";
import { ResponseSummary } from "./ResponseSummary";
import { ChevronLeft, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ResponsesClientProps {
  form: Form;
  fields: FormField[];
  initialSubmissions: FormSubmission[];
  // Nested map: submissionId → fieldId → value
  initialResponseMap: Record<string, Record<string, string>>;
  appUrl: string;
}

type Tab = "responses" | "summary";

function parseDisplay(raw: string, type: string): string {
  if (!raw) return "";
  if (type === "checkbox") {
    try {
      const arr: string[] = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.join(", ");
    } catch {}
  }
  if (type === "yes_no") return raw === "yes" ? "Yes" : "No";
  return raw;
}

export function ResponsesClient({
  form,
  fields,
  initialSubmissions,
  initialResponseMap,
  appUrl,
}: ResponsesClientProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [responseMap, setResponseMap] = useState(initialResponseMap);
  const [tab, setTab] = useState<Tab>("responses");
  const [selectedSub, setSelectedSub] = useState<FormSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  const visibleFields = fields.filter(
    (f) => f.type !== "section_header" && f.type !== "divider"
  );
  const tableFields = visibleFields.slice(0, 5);
  const publicUrl = `${appUrl}/f/${form.slug}`;

  function handleCopy() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const handleDeleted = useCallback((id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setResponseMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // Build summary data: for each visible field, collect all answers
  const summaryData = visibleFields.map((field) => ({
    field,
    answers: submissions.map((s) => responseMap[s.id]?.[field.id] ?? ""),
  }));

  return (
    <div className="p-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/forms/${form.id}`}
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

        <div className="flex items-center gap-2 shrink-0">
          {/* Copy share link */}
          {form.status === "published" && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              {copied ? <Check size={13} style={{ color: "var(--success)" }} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          )}

          {/* Open public form */}
          {form.status === "published" && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              <ExternalLink size={13} />
              View form
            </a>
          )}

          {/* Export buttons */}
          {submissions.length > 0 &&
            (["csv", "json", "xlsx", "pdf"] as const).map((fmt) => (
              <a
                key={fmt}
                href={`/api/export/${form.id}?format=${fmt}`}
                className="text-xs px-3 py-1.5 rounded border uppercase font-mono transition-colors"
                style={{
                  color: fmt === "pdf" ? "white" : "var(--text-muted)",
                  borderColor: fmt === "pdf" ? "transparent" : "var(--border)",
                  background: fmt === "pdf" ? "var(--accent)" : "transparent",
                }}
              >
                {fmt}
              </a>
            ))}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-md w-fit"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {(["responses", "summary"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="text-sm px-4 py-1.5 rounded transition-colors capitalize"
            style={{
              background: tab === t ? "var(--surface-elevated)" : "transparent",
              color: tab === t ? "var(--text)" : "var(--text-muted)",
              fontWeight: tab === t ? 500 : 400,
              border: tab === t ? "1px solid var(--border)" : "1px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Summary tab ────────────────────────────────────────────────── */}
      {tab === "summary" && (
        <ResponseSummary
          summaryFields={summaryData}
          totalSubmissions={submissions.length}
        />
      )}

      {/* ── Responses tab ──────────────────────────────────────────────── */}
      {tab === "responses" && (
        <>
          {submissions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 rounded-md"
              style={{ border: "1px dashed var(--border)" }}
            >
              <p className="font-medium mb-1" style={{ color: "var(--text)" }}>
                No responses yet
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {form.status === "published"
                  ? "Your form is live. Share the link to start collecting responses."
                  : "Publish your form to start collecting responses."}
              </p>
              {form.status === "published" && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm mt-4 px-4 py-2 rounded transition-colors"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Copy size={14} />
                  Copy share link
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                className="rounded-md overflow-auto"
                style={{ border: "1px solid var(--border)" }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: "var(--surface)",
                      }}
                    >
                      <th
                        className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap"
                        style={{ color: "var(--text-muted)" }}
                      >
                        #
                      </th>
                      <th
                        className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Submitted
                      </th>
                      {tableFields.map((f) => (
                        <th
                          key={f.id}
                          className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap"
                          style={{ color: "var(--text-muted)", maxWidth: 160 }}
                        >
                          <span className="block truncate max-w-[140px]">{f.label}</span>
                        </th>
                      ))}
                      {visibleFields.length > 5 && (
                        <th
                          className="px-4 py-3 text-xs font-medium"
                          style={{ color: "var(--text-disabled)" }}
                        >
                          +{visibleFields.length - 5} more
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, i) => {
                      const resMap = responseMap[sub.id] ?? {};
                      const isSelected = selectedSub?.id === sub.id;
                      return (
                        <tr
                          key={sub.id}
                          onClick={() => setSelectedSub(isSelected ? null : sub)}
                          className="cursor-pointer transition-colors"
                          style={{
                            borderBottom: "1px solid var(--border-muted)",
                            background: isSelected
                              ? "var(--accent-dim)"
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              (e.currentTarget as HTMLElement).style.background =
                                "var(--surface-elevated)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              (e.currentTarget as HTMLElement).style.background =
                                "transparent";
                          }}
                        >
                          <td
                            className="px-4 py-3 text-xs font-mono"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {submissions.length - i}
                          </td>
                          <td
                            className="px-4 py-3 text-xs whitespace-nowrap"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {formatDateTime(sub.submittedAt)}
                          </td>
                          {tableFields.map((f) => {
                            const display = parseDisplay(
                              resMap[f.id] ?? "",
                              f.type
                            );
                            return (
                              <td
                                key={f.id}
                                className="px-4 py-3 text-xs"
                                style={{
                                  color: display
                                    ? "var(--text)"
                                    : "var(--text-disabled)",
                                  maxWidth: 160,
                                }}
                                title={display || "—"}
                              >
                                <span className="block truncate max-w-[140px]">
                                  {display || "—"}
                                </span>
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
                  Showing {Math.min(5, visibleFields.length)} of {visibleFields.length} fields.
                  Export to see all columns.
                </p>
              )}

              <p className="text-xs mt-2" style={{ color: "var(--text-disabled)" }}>
                Click any row to view the full response.
              </p>
            </>
          )}
        </>
      )}

      {/* ── Submission detail drawer ────────────────────────────────────── */}
      {selectedSub && (
        <SubmissionDrawer
          submission={selectedSub}
          fields={fields}
          responses={responseMap[selectedSub.id] ?? {}}
          formId={form.id}
          onClose={() => setSelectedSub(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
