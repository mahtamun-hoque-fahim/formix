import { requireAdmin } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { users, forms, formSubmissions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  await requireAdmin();
  const db = getDb();

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  const formCounts = await db
    .select({ userId: forms.userId, count: count() })
    .from(forms)
    .groupBy(forms.userId);

  const subCounts = await db
    .select({ userId: forms.userId, count: count() })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .groupBy(forms.userId);

  const formMap = Object.fromEntries(formCounts.map((r) => [r.userId, Number(r.count)]));
  const subMap = Object.fromEntries(subCounts.map((r) => [r.userId, Number(r.count)]));

  const enriched = allUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    formCount: formMap[u.id] ?? 0,
    submissionCount: subMap[u.id] ?? 0,
  }));

  return <AdminUsersClient initialUsers={enriched} />;
}
