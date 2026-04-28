"use client";
import { useState, useMemo } from "react";
import { AdminUser, AdminUserDrawer } from "./AdminUserDrawer";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

interface AdminUsersClientProps {
  initialUsers: AdminUser[];
}

function PlanBadge({ plan }: { plan: string }) {
  return plan === "pro" ? (
    <span className="text-xs px-2 py-0.5 rounded-sm font-medium"
      style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.25)" }}>
      Pro
    </span>
  ) : (
    <span className="text-xs px-2 py-0.5 rounded-sm"
      style={{ background: "var(--surface-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
      Free
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <span className="text-xs px-2 py-0.5 rounded-sm font-medium"
      style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning)", border: "1px solid rgba(245,158,11,0.2)" }}>
      Admin
    </span>
  ) : (
    <span className="text-xs px-2 py-0.5 rounded-sm"
      style={{ background: "var(--surface-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
      User
    </span>
  );
}

export function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [filterRole, setFilterRole] = useState<"all" | "user" | "admin">("all");
  const [filterPlan, setFilterPlan] = useState<"all" | "free" | "pro">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q);
      const matchRole = filterRole === "all" || u.role === filterRole;
      const matchPlan = filterPlan === "all" || u.plan === filterPlan;
      return matchSearch && matchRole && matchPlan;
    });
  }, [users, search, filterRole, filterPlan]);

  function handleUpdated(updated: AdminUser) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelected((prev) => (prev?.id === updated.id ? { ...prev, ...updated } : prev));
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {users.length} total · {users.filter((u) => u.isActive).length} active
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded pl-8 pr-3 py-2 text-sm outline-none transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Role filter */}
        <div className="flex rounded overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {(["all", "user", "admin"] as const).map((r) => (
            <button key={r} onClick={() => setFilterRole(r)}
              className="px-3 py-1.5 text-xs capitalize transition-colors"
              style={{
                background: filterRole === r ? "var(--accent)" : "var(--surface)",
                color: filterRole === r ? "white" : "var(--text-muted)",
              }}>
              {r}
            </button>
          ))}
        </div>

        {/* Plan filter */}
        <div className="flex rounded overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {(["all", "free", "pro"] as const).map((p) => (
            <button key={p} onClick={() => setFilterPlan(p)}
              className="px-3 py-1.5 text-xs capitalize transition-colors"
              style={{
                background: filterPlan === p ? "var(--accent)" : "var(--surface)",
                color: filterPlan === p ? "white" : "var(--text-muted)",
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
              {["User", "Role", "Plan", "Forms", "Responses", "Joined", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium whitespace-nowrap"
                  style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No users match your search.
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const initials = user.name
                  ? user.name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
                  : user.email[0].toUpperCase();
                const isSelected = selected?.id === user.id;

                return (
                  <tr
                    key={user.id}
                    onClick={() => setSelected(isSelected ? null : user)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: "1px solid var(--border-muted)",
                      background: isSelected ? "var(--accent-dim)" : "transparent",
                      opacity: user.isActive ? 1 : 0.5,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-elevated)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                          style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-xs" style={{ color: "var(--text)" }}>
                            {user.name ?? "—"}
                          </p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-4 py-3"><PlanBadge plan={user.plan} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{user.formCount}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{user.submissionCount}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                      {formatDate(new Date(user.createdAt))}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-sm"
                        style={{
                          background: user.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: user.isActive ? "var(--success)" : "var(--destructive)",
                          border: `1px solid ${user.isActive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                        }}>
                        {user.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs mt-3" style={{ color: "var(--text-disabled)" }}>
          Showing {filtered.length} of {users.length} users · Click a row to manage
        </p>
      )}

      <AdminUserDrawer
        user={selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
