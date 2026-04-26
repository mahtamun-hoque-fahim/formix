import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { forms, formFields, formSubmissions, fieldResponses } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

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
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });

  const fields = await db.select().from(formFields)
    .where(eq(formFields.formId, id))
    .orderBy(formFields.order);

  const visibleFields = fields.filter((f) => f.type !== "section_header" && f.type !== "divider");

  const submissions = await db.select().from(formSubmissions)
    .where(eq(formSubmissions.formId, id))
    .orderBy(desc(formSubmissions.submittedAt));

  // Fetch all field responses
  const allResponses = submissions.length > 0
    ? await db.select().from(fieldResponses)
        .where(eq(fieldResponses.submissionId, submissions[0].id))
    : [];

  // Build rows: each submission → one row with field values
  const responseMap = new Map<string, Map<string, string>>();
  for (const r of allResponses) {
    if (!responseMap.has(r.submissionId)) responseMap.set(r.submissionId, new Map());
    responseMap.get(r.submissionId)!.set(r.fieldId, r.value ?? "");
  }

  const headers = ["#", "Submitted At", ...visibleFields.map((f) => f.label)];
  const rows = submissions.map((sub, i) => {
    const resMap = responseMap.get(sub.id) ?? new Map();
    return [
      String(i + 1),
      sub.submittedAt.toISOString(),
      ...visibleFields.map((f) => resMap.get(f.id) ?? ""),
    ];
  });

  if (format === "json") {
    const data = submissions.map((sub, i) => {
      const resMap = responseMap.get(sub.id) ?? new Map();
      const entry: Record<string, string | number> = {
        index: i + 1,
        submitted_at: sub.submittedAt.toISOString(),
      };
      for (const f of visibleFields) {
        entry[f.label] = resMap.get(f.id) ?? "";
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

  if (format === "csv") {
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${form.slug}-responses.csv"`,
      },
    });
  }

  // xlsx and pdf — Phase 5
  return Response.json(
    { error: `Export format '${format}' will be available in Phase 5.` },
    { status: 501 }
  );
}
