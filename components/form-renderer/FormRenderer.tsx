"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, Upload, X } from "lucide-react";
import { Form, FormField } from "@/lib/db/schema";

interface FormRendererProps {
  form: Form;
  fields: FormField[];
}

type FieldValue = string | string[];

export function FormRenderer({ form, fields }: FormRendererProps) {
  const router = useRouter();
  const accent = form.accentColor ?? "#6366f1";

  // Values map: fieldId → string | string[]
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [globalError, setGlobalError] = useState("");

  const setValue = useCallback((id: string, val: FieldValue) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.type === "section_header" || field.type === "divider") continue;
      if (!field.isRequired) continue;
      const val = values[field.id];
      if (field.type === "checkbox") {
        if (!Array.isArray(val) || val.length === 0) {
          newErrors[field.id] = "Please select at least one option.";
        }
      } else if (field.type === "rating") {
        if (!val || val === "0") newErrors[field.id] = "Please select a rating.";
      } else {
        if (!val || String(val).trim() === "") {
          newErrors[field.id] = "This field is required.";
        }
      }
      // Email format
      if (field.type === "email" && val) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val));
        if (!ok) newErrors[field.id] = "Please enter a valid email address.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) {
      // Scroll to first error
      const firstErrId = Object.keys(errors)[0];
      document.getElementById(`field-${firstErrId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setGlobalError("");

    const responses = fields
      .filter((f) => f.type !== "section_header" && f.type !== "divider")
      .map((f) => {
        const val = values[f.id];
        return {
          fieldId: f.id,
          value: Array.isArray(val) ? JSON.stringify(val) : (val ?? ""),
        };
      });

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: form.id, responses }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldId) {
          setErrors({ [data.fieldId]: data.error });
          document.getElementById(`field-${data.fieldId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          setGlobalError(data.error ?? "Something went wrong.");
        }
        return;
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        setSuccessMessage(data.successMessage ?? "Thank you for your response!");
        setSubmitted(true);
      }
    } catch {
      setGlobalError("Could not submit. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
        >
          ✓
        </div>
        <h2 className="text-xl font-bold font-syne" style={{ color: "var(--text)" }}>
          Submitted!
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
          {successMessage}
        </p>
        {form.allowMultipleSubmissions && (
          <button
            onClick={() => { setValues({}); setErrors({}); setSubmitted(false); }}
            className="text-sm mt-2 underline underline-offset-2"
            style={{ color: accent }}
          >
            Submit another response
          </button>
        )}
      </div>
    );
  }

  const visibleFields = fields.filter((f) => f.type !== "section_header" && f.type !== "divider");

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => (
        <FieldInput
          key={field.id}
          field={field}
          value={values[field.id]}
          error={errors[field.id]}
          accent={accent}
          onChange={(val) => setValue(field.id, val)}
        />
      ))}

      {globalError && (
        <p className="text-sm text-center" style={{ color: "var(--destructive)" }}>
          {globalError}
        </p>
      )}

      {visibleFields.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 rounded text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 mt-2"
          style={{ background: accent }}
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Submitting…" : "Submit"}
        </button>
      )}
    </div>
  );
}

// ── Per-field renderer ───────────────────────────────────────────────────────

interface FieldInputProps {
  field: FormField;
  value: FieldValue | undefined;
  error: string | undefined;
  accent: string;
  onChange: (val: FieldValue) => void;
}

function FieldInput({ field, value, error, accent, onChange }: FieldInputProps) {
  const opts = field.options as Record<string, unknown> | null;

  const inputBase: React.CSSProperties = {
    background: "var(--surface-elevated)",
    border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
    color: "var(--text)",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    transition: "border-color 150ms",
  };

  function focusStyle(e: React.FocusEvent<HTMLElement>) {
    if (!error) (e.currentTarget as HTMLElement).style.borderColor = accent;
  }
  function blurStyle(e: React.FocusEvent<HTMLElement>) {
    (e.currentTarget as HTMLElement).style.borderColor = error ? "var(--destructive)" : "var(--border)";
  }

  // ── Display-only ──────────────────────────────────────────────────────────
  if (field.type === "divider") {
    return <hr style={{ borderColor: "var(--border)" }} />;
  }
  if (field.type === "section_header") {
    return (
      <h2
        id={`field-${field.id}`}
        className="text-base font-semibold font-syne pt-2"
        style={{ color: "var(--text)" }}
      >
        {field.label}
      </h2>
    );
  }

  // ── Wrapper for all real fields ───────────────────────────────────────────
  return (
    <div id={`field-${field.id}`} className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
        {field.label}
        {field.isRequired && (
          <span className="ml-1" style={{ color: "var(--destructive)" }}>*</span>
        )}
      </label>

      {field.helpText && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{field.helpText}</p>
      )}

      <FieldControl
        field={field}
        value={value}
        error={error}
        accent={accent}
        opts={opts}
        inputBase={inputBase}
        focusStyle={focusStyle}
        blurStyle={blurStyle}
        onChange={onChange}
      />

      {error && (
        <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>
      )}
    </div>
  );
}

interface FieldControlProps {
  field: FormField;
  value: FieldValue | undefined;
  error: string | undefined;
  accent: string;
  opts: Record<string, unknown> | null;
  inputBase: React.CSSProperties;
  focusStyle: (e: React.FocusEvent<HTMLElement>) => void;
  blurStyle: (e: React.FocusEvent<HTMLElement>) => void;
  onChange: (val: FieldValue) => void;
}

function FieldControl({ field, value, error, accent, opts, inputBase, focusStyle, blurStyle, onChange }: FieldControlProps) {
  const choices = (opts?.choices as string[]) ?? [];

  switch (field.type) {
    // ── Long text ────────────────────────────────────────────────────────────
    case "long_text":
      return (
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          rows={4}
          onFocus={focusStyle}
          onBlur={blurStyle}
          style={{ ...inputBase, resize: "vertical", minHeight: 96 }}
        />
      );

    // ── Short inputs (text, email, phone, number) ────────────────────────────
    case "short_text":
    case "email":
    case "phone":
    case "number":
      return (
        <input
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : field.type === "number" ? "number" : "text"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          min={(opts?.min as number) ?? undefined}
          max={(opts?.max as number) ?? undefined}
          step={(opts?.step as number) ?? undefined}
          onFocus={focusStyle}
          onBlur={blurStyle}
          style={inputBase}
        />
      );

    // ── Date / Time / DateTime ───────────────────────────────────────────────
    case "date":
    case "time":
    case "datetime":
      return (
        <input
          type={field.type === "datetime" ? "datetime-local" : field.type}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          onFocus={focusStyle}
          onBlur={blurStyle}
          style={{ ...inputBase, colorScheme: "dark" }}
        />
      );

    // ── Dropdown ─────────────────────────────────────────────────────────────
    case "dropdown":
      return (
        <div className="relative">
          <select
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onFocus={focusStyle}
            onBlur={blurStyle}
            style={{ ...inputBase, appearance: "none", paddingRight: 32 }}
          >
            <option value="">Select an option…</option>
            {choices.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
            style={{ color: "var(--text-muted)" }}
          >▾</span>
        </div>
      );

    // ── Radio ────────────────────────────────────────────────────────────────
    case "radio":
      return (
        <div className="flex flex-col gap-2">
          {choices.map((c) => (
            <label
              key={c}
              className="flex items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 transition-colors"
              style={{
                border: `1px solid ${value === c ? `${accent}50` : "var(--border)"}`,
                background: value === c ? `${accent}10` : "var(--surface-elevated)",
              }}
            >
              <div
                className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                style={{
                  border: `2px solid ${value === c ? accent : "var(--border)"}`,
                }}
              >
                {value === c && (
                  <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
                )}
              </div>
              <span className="text-sm" style={{ color: "var(--text)" }}>{c}</span>
              <input
                type="radio"
                className="sr-only"
                value={c}
                checked={value === c}
                onChange={() => onChange(c)}
              />
            </label>
          ))}
        </div>
      );

    // ── Checkbox ─────────────────────────────────────────────────────────────
    case "checkbox": {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-col gap-2">
          {choices.map((c) => {
            const checked = selected.includes(c);
            return (
              <label
                key={c}
                className="flex items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 transition-colors"
                style={{
                  border: `1px solid ${checked ? `${accent}50` : "var(--border)"}`,
                  background: checked ? `${accent}10` : "var(--surface-elevated)",
                }}
              >
                <div
                  className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    background: checked ? accent : "transparent",
                    border: `2px solid ${checked ? accent : "var(--border)"}`,
                  }}
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm" style={{ color: "var(--text)" }}>{c}</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selected.filter((v) => v !== c)
                      : [...selected, c];
                    onChange(next);
                  }}
                />
              </label>
            );
          })}
        </div>
      );
    }

    // ── Rating ───────────────────────────────────────────────────────────────
    case "rating": {
      const max = (opts?.max as number) ?? 5;
      const current = Number(value ?? 0);
      return (
        <div className="flex gap-1.5">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(String(n))}
              className="transition-transform hover:scale-110 active:scale-95"
              aria-label={`Rate ${n} of ${max}`}
            >
              <Star
                size={28}
                fill={n <= current ? accent : "none"}
                style={{ color: n <= current ? accent : "var(--border)" }}
              />
            </button>
          ))}
        </div>
      );
    }

    // ── Yes / No ─────────────────────────────────────────────────────────────
    case "yes_no":
      return (
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt.toLowerCase())}
              className="flex-1 py-2.5 rounded text-sm font-medium transition-colors"
              style={{
                border: `1px solid ${value === opt.toLowerCase() ? `${accent}50` : "var(--border)"}`,
                background: value === opt.toLowerCase() ? `${accent}15` : "var(--surface-elevated)",
                color: value === opt.toLowerCase() ? accent : "var(--text-muted)",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      );

    // ── File Upload ──────────────────────────────────────────────────────────
    case "file_upload": {
      const fileName = String(value ?? "");
      return (
        <div>
          {fileName ? (
            <div
              className="flex items-center justify-between rounded-md px-3 py-2.5"
              style={{ border: `1px solid ${accent}50`, background: `${accent}10` }}
            >
              <span className="text-sm truncate" style={{ color: "var(--text)" }}>
                {fileName.split("/").pop()}
              </span>
              <button
                type="button"
                onClick={() => onChange("")}
                style={{ color: "var(--text-muted)" }}
                className="ml-2 shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center gap-2 rounded-md cursor-pointer transition-colors py-8"
              style={{
                border: `1px dashed ${error ? "var(--destructive)" : "var(--border)"}`,
                background: "var(--surface-elevated)",
              }}
            >
              <Upload size={20} style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                Click to upload
              </span>
              <span className="text-xs" style={{ color: "var(--text-disabled)" }}>
                {(opts?.allowedTypes as string[])?.join(", ") || "Any file"}
                {opts?.maxSizeMb ? ` · Max ${opts.maxSizeMb}MB` : ""}
              </span>
              <input
                type="file"
                className="sr-only"
                accept={(opts?.allowedTypes as string[])?.join(",") || undefined}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file.name); // Phase 5 will upload to Cloudinary
                }}
              />
            </label>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}
