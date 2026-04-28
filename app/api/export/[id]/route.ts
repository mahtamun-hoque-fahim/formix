import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { forms, formFields, formSubmissions, fieldResponses } from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "csv";

  const db = getDb();
  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });

  const fields = await db
    .select()
    .from(formFields)
    .where(eq(formFields.formId, id))
    .orderBy(formFields.order);

  const visibleFields = fields.filter(
    (f) => f.type !== "section_header" && f.type !== "divider"
  );

  const submissions = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.formId, id))
    .orderBy(desc(formSubmissions.submittedAt));

  // Load ALL field responses in one query
  const submissionIds = submissions.map((s) => s.id);
  const allResponses =
    submissionIds.length > 0
      ? await db
          .select()
          .from(fieldResponses)
          .where(inArray(fieldResponses.submissionId, submissionIds))
      : [];

  // Build nested map: submissionId → fieldId → value
  const responseMap = new Map<string, Map<string, string>>();
  for (const r of allResponses) {
    if (!responseMap.has(r.submissionId))
      responseMap.set(r.submissionId, new Map());
    responseMap.get(r.submissionId)!.set(r.fieldId, r.value ?? "");
  }

  function getDisplayValue(raw: string, fieldType: string): string {
    if (!raw) return "";
    // Checkbox arrays stored as JSON
    if (fieldType === "checkbox") {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.join(", ");
      } catch {}
    }
    return raw;
  }

  const headers = [
    "#",
    "Submitted At",
    "Respondent Email",
    ...visibleFields.map((f) => f.label),
  ];

  const rows = submissions.map((sub, i) => {
    const resMap = responseMap.get(sub.id) ?? new Map<string, string>();
    return [
      String(i + 1),
      sub.submittedAt.toISOString(),
      sub.respondentEmail ?? "",
      ...visibleFields.map((f) =>
        getDisplayValue(resMap.get(f.id) ?? "", f.type)
      ),
    ];
  });

  // ── JSON ──────────────────────────────────────────────────────────────────
  if (format === "json") {
    const data = submissions.map((sub, i) => {
      const resMap = responseMap.get(sub.id) ?? new Map<string, string>();
      const entry: Record<string, string | number> = {
        index: i + 1,
        submitted_at: sub.submittedAt.toISOString(),
        respondent_email: sub.respondentEmail ?? "",
      };
      for (const f of visibleFields) {
        entry[f.label] = getDisplayValue(resMap.get(f.id) ?? "", f.type);
      }
      return entry;
    });
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${form.slug}-responses.json"`,
      },
    });
  }

  // ── CSV ───────────────────────────────────────────────────────────────────
  if (format === "csv") {
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${form.slug}-responses.csv"`,
      },
    });
  }

  // ── XLSX (Phase 5 — requires xlsx npm package) ────────────────────────────
  if (format === "xlsx") {
    return Response.json(
      { error: "XLSX export will be available in Phase 5." },
      { status: 501 }
    );
  }

  // ── PDF (Phase 5 — requires jspdf) ───────────────────────────────────────
  if (format === "pdf") {
    return Response.json(
      { error: "PDF export will be available in Phase 5." },
      { status: 501 }
    );
  }

  return Response.json({ error: `Unknown format: ${format}` }, { status: 400 });
}
