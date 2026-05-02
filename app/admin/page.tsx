import { requireAdmin } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { users, forms, formSubmissions } from "@/lib/db/schema";
import { count, eq, gte, desc } from "drizzle-orm";
import { Users, FileText, Send, Shield, TrendingUp, BarChart2 } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Admin — Overview" };

export default async function AdminPage() {
  await requireAdmin();
  const db = getDb();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);

  const [
    [totalUsers], [totalForms], [totalSubs],
    [newUsers30d], [newForms30d], [newSubs30d], [newSubs7d],
    [publishedForms], [proUsers],
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(forms),
    db.select({ count: count() }).from(formSubmissions),
    db.select({ count: count() }).from(users).where(gte(users.createdAt, thirtyDaysAgo)),
    db.select({ count: count() }).from(forms).where(gte(forms.createdAt, thirtyDaysAgo)),
    db.select({ count: count() }).from(formSubmissions).where(gte(formSubmissions.submittedAt, thirtyDaysAgo)),
    db.select({ count: count() }).from(formSubmissions).where(gte(formSubmissions.submittedAt, sevenDaysAgo)),
    db.select({ count: count() }).from(forms).where(eq(forms.status, "published")),
    db.select({ count: count() }).from(users).where(eq(users.plan, "pro")),
  ]);

  const recentUsers = await db
    .select({ id: users.id, email: users.email, name: users.name, createdAt: users.createdAt, plan: users.plan })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(5);

  const recentSubs = await db
    .select({
      id: formSubmissions.id,
      submittedAt: formSubmissions.submittedAt,
      respondentEmail: formSubmissions.respondentEmail,
      formTitle: forms.title,
      formId: forms.id,
    })
    .from(formSubmissions)
    .innerJoin(forms, eq(formSubmissions.formId, forms.id))
    .orderBy(desc(formSubmissions.submittedAt))
    .limit(5);

  const primaryStats = [
    { label: "Total Users",     value: Number(totalUsers?.count ?? 0),    sub: `+${Number(newUsers30d?.count ?? 0)} this month`, icon: Users,     href: "/admin/users" },
    { label: "Total Forms",     value: Number(totalForms?.count ?? 0),    sub: `${Number(publishedForms?.count ?? 0)} published`,  icon: FileText,  href: "/admin/forms" },
    { label: "Total Responses", value: Number(totalSubs?.count ?? 0),     sub: `+${Number(newSubs7d?.count ?? 0)} this week`,     icon: Send,      href: "/admin/forms" },
  ];

  const secondaryStats = [
    { label: "New Forms (30d)",  value: Number(newForms30d?.count ?? 0),  icon: BarChart2 },
    { label: "New Responses (30d)", value: Number(newSubs30d?.count ?? 0), icon: TrendingUp },
    { label: "Pro Users",        value: Number(proUsers?.count ?? 0),      icon: Shield },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield size={20} style={{ color: "var(--accent)" }} />
        <div>
          <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>Admin Panel</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Platform-wide overview</p>
        </div>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {primaryStats.map((s) => (
          <Link key={s.label} href={s.href}
            className="rounded-md p-5 transition-colors block"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</span>
              <s.icon size={16} style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-3xl font-bold font-syne" style={{ color: "var(--text)" }}>
              {s.value.toLocaleString()}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {secondaryStats.map((s) => (
          <div key={s.label} className="rounded-md px-5 py-3 flex items-center justify-between"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <s.icon size={14} style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
            <span className="text-lg font-bold font-syne" style={{ color: "var(--text)" }}>
              {s.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Recent activity grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent signups */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold font-syne" style={{ color: "var(--text)" }}>
              Recent Signups
            </h2>
            <Link href="/admin/users" className="text-xs" style={{ color: "var(--accent)" }}>
              View all →
            </Link>
          </div>
          <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {recentUsers.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No users yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium" style={{ color: "var(--text)" }}>{u.name ?? "—"}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-sm"
                          style={{
                            background: u.plan === "pro" ? "var(--accent-dim)" : "var(--surface-elevated)",
                            color: u.plan === "pro" ? "var(--accent)" : "var(--text-muted)",
                          }}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right whitespace-nowrap"
                        style={{ color: "var(--text-disabled)" }}>
                        {formatDateTime(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent submissions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold font-syne" style={{ color: "var(--text)" }}>
              Recent Responses
            </h2>
            <Link href="/admin/forms" className="text-xs" style={{ color: "var(--accent)" }}>
              View all →
            </Link>
          </div>
          <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {recentSubs.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No responses yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {recentSubs.map((s) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid var(--border-muted)" }}>
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/forms/${s.formId}/responses`}
                          className="text-xs font-medium hover:underline"
                          style={{ color: "var(--accent)" }}>
                          {s.formTitle}
                        </Link>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {s.respondentEmail ?? "Anonymous"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-right whitespace-nowrap"
                        style={{ color: "var(--text-disabled)" }}>
                        {formatDateTime(s.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
