"use client";
import { X, Trash2, Loader2, Star } from "lucide-react";
import { FormField, FormSubmission } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";

interface SubmissionDrawerProps {
  submission: FormSubmission | null;
  fields: FormField[];
  responses: Record<string, string>; // fieldId → value
  formId: string;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

function formatValue(value: string, type: string): React.ReactNode {
  if (!value || value === "") return <span style={{ color: "var(--text-disabled)" }}>—</span>;

  if (type === "checkbox") {
    try {
      const arr: string[] = JSON.parse(value);
      if (Array.isArray(arr)) {
        return (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {arr.map((v) => (
              <span
                key={v}
                className="text-xs px-2 py-0.5 rounded-sm"
                style={{ background: "var(--surface-elevated)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                {v}
              </span>
            ))}
          </div>
        );
      }
    } catch {}
  }

  if (type === "rating") {
    const n = Number(value);
    return (
      <div className="flex gap-1 mt-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < n ? "var(--accent)" : "none"}
            style={{ color: i < n ? "var(--accent)" : "var(--border)" }}
          />
        ))}
        <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>({n}/5)</span>
      </div>
    );
  }

  if (type === "yes_no") {
    return (
      <span
        className="text-xs px-2.5 py-1 rounded-sm font-medium"
        style={{
          background: value === "yes" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
          color: value === "yes" ? "var(--success)" : "var(--destructive)",
          border: `1px solid ${value === "yes" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
        }}
      >
        {value === "yes" ? "Yes" : "No"}
      </span>
    );
  }

  if (type === "long_text") {
    return (
      <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text)" }}>
        {value}
      </p>
    );
  }

  if (type === "file_upload") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline underline-offset-2 break-all"
        style={{ color: "var(--accent)" }}
      >
        {value.split("/").pop() ?? value}
      </a>
    );
  }

  return <span className="text-sm" style={{ color: "var(--text)" }}>{value}</span>;
}

export function SubmissionDrawer({
  submission,
  fields,
  responses,
  formId,
  onClose,
  onDeleted,
}: SubmissionDrawerProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!submission) return null;

  const visibleFields = fields.filter(
    (f) => f.type !== "section_header" && f.type !== "divider"
  );

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/forms/${formId}/submissions/${submission!.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onDeleted(submission!.id);
        onClose();
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-40 flex flex-col overflow-hidden"
        style={{
          width: 420,
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Response Detail
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {formatDateTime(submission.submittedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded transition-colors"
                style={{ color: "var(--text-muted)" }}
                title="Delete this response"
              >
                <Trash2 size={15} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Delete?
                </span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium"
                  style={{ background: "var(--destructive)", color: "white" }}
                >
                  {deleting ? <Loader2 size={11} className="animate-spin" /> : null}
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs px-2.5 py-1 rounded"
                  style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                >
                  No
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Meta */}
        {(submission.respondentEmail || submission.ipAddress) && (
          <div
            className="px-5 py-3 flex flex-col gap-1 shrink-0"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}
          >
            {submission.respondentEmail && (
              <div className="flex items-center gap-2">
                <span className="text-xs w-20 shrink-0" style={{ color: "var(--text-muted)" }}>Email</span>
                <span className="text-xs font-mono" style={{ color: "var(--text)" }}>
                  {submission.respondentEmail}
                </span>
              </div>
            )}
            {submission.ipAddress && (
              <div className="flex items-center gap-2">
                <span className="text-xs w-20 shrink-0" style={{ color: "var(--text-muted)" }}>IP</span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {submission.ipAddress}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Field answers */}
        <div className="flex-1 overflow-y-auto">
          {visibleFields.map((field, i) => (
            <div
              key={field.id}
              className="px-5 py-4"
              style={{
                borderBottom: i < visibleFields.length - 1 ? "1px solid var(--border-muted)" : "none",
              }}
            >
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                {field.label}
                {field.isRequired && (
                  <span className="ml-1" style={{ color: "var(--destructive)" }}>*</span>
                )}
              </p>
              {formatValue(responses[field.id] ?? "", field.type)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
