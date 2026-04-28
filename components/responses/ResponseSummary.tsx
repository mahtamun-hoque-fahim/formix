"use client";
import { FormField } from "@/lib/db/schema";
import { Star } from "lucide-react";

interface SummaryField {
  field: FormField;
  answers: string[]; // raw values for this field across all submissions
}

interface ResponseSummaryProps {
  summaryFields: SummaryField[];
  totalSubmissions: number;
}

export function ResponseSummary({ summaryFields, totalSubmissions }: ResponseSummaryProps) {
  if (totalSubmissions === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-md"
        style={{ border: "1px dashed var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No responses to summarize yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {summaryFields.map(({ field, answers }) => {
        const answered = answers.filter((v) => v && v.trim() !== "" && v !== "[]");
        const responseRate = totalSubmissions > 0
          ? Math.round((answered.length / totalSubmissions) * 100)
          : 0;

        return (
          <div
            key={field.id}
            className="rounded-md p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {/* Field header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {field.label}
                  {field.isRequired && (
                    <span className="ml-1" style={{ color: "var(--destructive)" }}>*</span>
                  )}
                </p>
                <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
                  {field.type.replace("_", " ")}
                </p>
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {answered.length}/{totalSubmissions} answered ({responseRate}%)
              </span>
            </div>

            {/* Field-type specific stats */}
            <FieldStats field={field} answers={answered} total={totalSubmissions} />
          </div>
        );
      })}
    </div>
  );
}

function FieldStats({
  field,
  answers,
  total,
}: {
  field: FormField;
  answers: string[];
  total: number;
}) {
  if (answers.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--text-disabled)" }}>No answers yet.</p>
    );
  }

  // ── Rating ────────────────────────────────────────────────────────────────
  if (field.type === "rating") {
    const nums = answers.map(Number).filter((n) => !isNaN(n));
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    const opts = field.options as { max?: number } | null;
    const max = opts?.max ?? 5;
    const dist: Record<number, number> = {};
    for (let i = 1; i <= max; i++) dist[i] = 0;
    nums.forEach((n) => { if (dist[n] !== undefined) dist[n]++; });

    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold font-syne" style={{ color: "var(--text)" }}>
            {avg.toFixed(1)}
          </span>
          <div>
            <div className="flex gap-0.5">
              {Array.from({ length: max }, (_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(avg) ? "var(--accent)" : "none"}
                  style={{ color: i < Math.round(avg) ? "var(--accent)" : "var(--border)" }}
                />
              ))}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              avg of {nums.length} rating{nums.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: max }, (_, i) => i + 1)
            .reverse()
            .map((n) => {
              const cnt = dist[n] ?? 0;
              const pct = nums.length > 0 ? (cnt / nums.length) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-3">
                  <span className="text-xs w-4 text-right shrink-0" style={{ color: "var(--text-muted)" }}>{n}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: "var(--accent)" }}
                    />
                  </div>
                  <span className="text-xs w-6 shrink-0" style={{ color: "var(--text-muted)" }}>{cnt}</span>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // ── Yes / No ──────────────────────────────────────────────────────────────
  if (field.type === "yes_no") {
    const yesCount = answers.filter((a) => a === "yes").length;
    const noCount = answers.filter((a) => a === "no").length;
    const yesPct = answers.length > 0 ? Math.round((yesCount / answers.length) * 100) : 0;
    const noPct = 100 - yesPct;

    return (
      <div className="flex flex-col gap-2">
        {[
          { label: "Yes", count: yesCount, pct: yesPct, color: "var(--success)" },
          { label: "No", count: noCount, pct: noPct, color: "var(--destructive)" },
        ].map(({ label, count, pct, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs w-6 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-xs w-16 shrink-0 text-right" style={{ color: "var(--text-muted)" }}>
              {count} ({pct}%)
            </span>
          </div>
        ))}
      </div>
    );
  }

  // ── Radio / Dropdown / Checkbox ───────────────────────────────────────────
  if (field.type === "radio" || field.type === "dropdown" || field.type === "checkbox") {
    const opts = field.options as { choices?: string[] } | null;
    const choices = opts?.choices ?? [];

    // Flatten checkbox arrays
    const flat: string[] = [];
    for (const a of answers) {
      if (field.type === "checkbox") {
        try {
          const arr: string[] = JSON.parse(a);
          if (Array.isArray(arr)) { flat.push(...arr); continue; }
        } catch {}
      }
      flat.push(a);
    }

    const counts: Record<string, number> = {};
    for (const v of flat) counts[v] = (counts[v] ?? 0) + 1;

    // Sort by count desc, include defined choices + any write-in values
    const allKeys = Array.from(
      new Set([...choices, ...Object.keys(counts)])
    ).sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0));

    const maxCount = Math.max(...Object.values(counts), 1);

    return (
      <div className="flex flex-col gap-2">
        {allKeys.map((choice) => {
          const cnt = counts[choice] ?? 0;
          const pct = Math.round((cnt / flat.length) * 100) || 0;
          const barPct = (cnt / maxCount) * 100;

          return (
            <div key={choice} className="flex items-center gap-3">
              <span
                className="text-xs shrink-0 truncate"
                style={{ color: "var(--text)", width: 120 }}
                title={choice}
              >
                {choice}
              </span>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${barPct}%`, background: "var(--accent)" }}
                />
              </div>
              <span className="text-xs w-16 shrink-0 text-right" style={{ color: "var(--text-muted)" }}>
                {cnt} ({pct}%)
              </span>
            </div>
          );
        })}
        {field.type === "checkbox" && (
          <p className="text-xs mt-1" style={{ color: "var(--text-disabled)" }}>
            Checkbox — respondents may select multiple options
          </p>
        )}
      </div>
    );
  }

  // ── Text / Email / Phone / Number ─────────────────────────────────────────
  if (
    field.type === "short_text" ||
    field.type === "long_text" ||
    field.type === "email" ||
    field.type === "phone" ||
    field.type === "number"
  ) {
    // For number: show avg, min, max
    if (field.type === "number") {
      const nums = answers.map(Number).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        const min = Math.min(...nums);
        const max = Math.max(...nums);
        return (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Average", value: avg.toFixed(2) },
              { label: "Min", value: String(min) },
              { label: "Max", value: String(max) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-md p-3 text-center"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)" }}
              >
                <p className="text-lg font-bold font-syne" style={{ color: "var(--text)" }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        );
      }
    }

    // For text: show last 3 answers as preview
    const preview = answers.slice(0, 3);
    return (
      <div className="flex flex-col gap-2">
        {preview.map((ans, i) => (
          <div
            key={i}
            className="rounded px-3 py-2 text-sm"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <span className="line-clamp-2">{ans}</span>
          </div>
        ))}
        {answers.length > 3 && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            +{answers.length - 3} more — export to CSV to see all
          </p>
        )}
      </div>
    );
  }

  // ── Date / Time ───────────────────────────────────────────────────────────
  if (field.type === "date" || field.type === "time" || field.type === "datetime") {
    const preview = answers.slice(0, 4);
    return (
      <div className="flex flex-wrap gap-2">
        {preview.map((ans, i) => (
          <span
            key={i}
            className="text-xs px-2.5 py-1 rounded-sm font-mono"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            {ans}
          </span>
        ))}
        {answers.length > 4 && (
          <span className="text-xs self-center" style={{ color: "var(--text-muted)" }}>
            +{answers.length - 4} more
          </span>
        )}
      </div>
    );
  }

  return null;
}
