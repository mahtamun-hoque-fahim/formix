import { requireAdmin } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { users, forms, formSubmissions } from "@/lib/db/schema";
import { count, eq, gte, desc } from "drizzle-orm";

export async function GET() {
  await requireAdmin();
  const db = getDb();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [[totalUsers], [totalForms], [totalSubs]] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(forms),
    db.select({ count: count() }).from(formSubmissions),
  ]);

  const [[newUsers30d], [newForms30d], [newSubs30d]] = await Promise.all([
    db.select({ count: count() }).from(users).where(gte(users.createdAt, thirtyDaysAgo)),
    db.select({ count: count() }).from(forms).where(gte(forms.createdAt, thirtyDaysAgo)),
    db.select({ count: count() }).from(formSubmissions).where(gte(formSubmissions.submittedAt, thirtyDaysAgo)),
  ]);

  const [[newSubs7d]] = await Promise.all([
    db.select({ count: count() }).from(formSubmissions).where(gte(formSubmissions.submittedAt, sevenDaysAgo)),
  ]);

  const [publishedForms] = await db
    .select({ count: count() })
    .from(forms)
    .where(eq(forms.status, "published"));

  const [proUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.plan, "pro"));

  const [activeUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.isActive, true));

  // Recent signups
  const recentUsers = await db
    .select({ id: users.id, email: users.email, name: users.name, createdAt: users.createdAt, plan: users.plan })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(5);

  // Recent submissions
  const recentSubs = await db
    .select({
      id: formSubmissions.id,
      submittedAt: formSubmissions.submittedAt,
      formId: formSubmissions.formId,
      respondentEmail: formSubmissions.respondentEmail,
      formTitle: forms.title,
      formSlug: forms.slug,
    })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .orderBy(desc(formSubmissions.submittedAt))
    .limit(5);

  return Response.json({
    totals: {
      users: Number(totalUsers?.count ?? 0),
      forms: Number(totalForms?.count ?? 0),
      submissions: Number(totalSubs?.count ?? 0),
      publishedForms: Number(publishedForms?.count ?? 0),
      proUsers: Number(proUsers?.count ?? 0),
      activeUsers: Number(activeUsers?.count ?? 0),
    },
    growth: {
      newUsers30d: Number(newUsers30d?.count ?? 0),
      newForms30d: Number(newForms30d?.count ?? 0),
      newSubs30d: Number(newSubs30d?.count ?? 0),
      newSubs7d: Number(newSubs7d?.count ?? 0),
    },
    recentUsers,
    recentSubs,
  });
}
