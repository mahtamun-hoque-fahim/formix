import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { forms, formFields, formSubmissions, fieldResponses } from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { buildXlsx } from "@/lib/export/excel";
import { buildPdf } from "@/lib/export/pdf";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(req.url);
  const format = (url.searchParams.get("format") ?? "csv").toLowerCase();

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

  const submissionIds = submissions.map((s) => s.id);
  const allResponses =
    submissionIds.length > 0
      ? await db
          .select()
          .from(fieldResponses)
          .where(inArray(fieldResponses.submissionId, submissionIds))
      : [];

  // submissionId → fieldId → raw value
  const responseMap = new Map<string, Map<string, string>>();
  for (const r of allResponses) {
    if (!responseMap.has(r.submissionId))
      responseMap.set(r.submissionId, new Map());
    responseMap.get(r.submissionId)!.set(r.fieldId, r.value ?? "");
  }

  function display(raw: string, type: string): string {
    if (!raw) return "";
    if (type === "checkbox") {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.join(", ");
      } catch {}
    }
    if (type === "yes_no") return raw === "yes" ? "Yes" : "No";
    return raw;
  }

  // Shared header + rows used by CSV / XLSX / PDF
  const columnHeaders = [
    "#",
    "Submitted At",
    "Respondent Email",
    ...visibleFields.map((f) => f.label),
  ];

  const rows = submissions.map((sub, i) => {
    const resMap = responseMap.get(sub.id) ?? new Map<string, string>();
    return [
      String(i + 1),
      sub.submittedAt.toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      sub.respondentEmail ?? "",
      ...visibleFields.map((f) => display(resMap.get(f.id) ?? "", f.type)),
    ];
  });

  // Structured row objects for XLSX / PDF builders
  const structuredRows = rows.map((row) => {
    const obj: Record<string, string | number> = {};
    columnHeaders.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    obj["#"] = Number(obj["#"]);
    return obj as { index: number; submittedAt: string; respondentEmail: string } & Record<string, string | number>;
  });

  const filename = `${form.slug}-responses`;

  // ── CSV ─────────────────────────────────────────────────────────────────
  if (format === "csv") {
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [columnHeaders, ...rows]
      .map((r) => r.map(escape).join(","))
      .join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.csv"`,
      },
    });
  }

  // ── JSON ─────────────────────────────────────────────────────────────────
  if (format === "json") {
    return new Response(JSON.stringify(structuredRows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}.json"`,
      },
    });
  }

  // ── XLSX ─────────────────────────────────────────────────────────────────
  if (format === "xlsx") {
    const buffer = buildXlsx(structuredRows as Parameters<typeof buildXlsx>[0], form.title);
    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  }

  // ── PDF ──────────────────────────────────────────────────────────────────
  if (format === "pdf") {
    const buffer = buildPdf(
      structuredRows as Parameters<typeof buildPdf>[0],
      form.title,
      form.slug
    );
    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return Response.json({ error: `Unknown format: ${format}` }, { status: 400 });
}
