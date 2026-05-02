import { requireAdmin } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { forms, users, formSubmissions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";

export async function GET() {
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

  const subMap = Object.fromEntries(
    subCounts.map((r) => [r.formId, Number(r.count)])
  );

  return Response.json(
    allForms.map((f) => ({ ...f, submissionCount: subMap[f.id] ?? 0 }))
  );
}
