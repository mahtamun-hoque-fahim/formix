import { requireAdmin } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { users, forms, formSubmissions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";

export async function GET() {
  await requireAdmin();
  const db = getDb();

  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  // Form counts per user
  const formCounts = await db
    .select({ userId: forms.userId, count: count() })
    .from(forms)
    .groupBy(forms.userId);

  // Submission counts per user (via forms join)
  const subCounts = await db
    .select({ userId: forms.userId, count: count() })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .groupBy(forms.userId);

  const formMap = Object.fromEntries(formCounts.map((r) => [r.userId, Number(r.count)]));
  const subMap = Object.fromEntries(subCounts.map((r) => [r.userId, Number(r.count)]));

  const result = allUsers.map((u) => ({
    ...u,
    formCount: formMap[u.id] ?? 0,
    submissionCount: subMap[u.id] ?? 0,
  }));

  return Response.json(result);
}
