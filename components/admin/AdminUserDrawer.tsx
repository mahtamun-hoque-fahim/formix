"use client";
import { useState } from "react";
import { X, Loader2, ExternalLink } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  formCount: number;
  submissionCount: number;
}

interface AdminUserDrawerProps {
  user: AdminUser | null;
  onClose: () => void;
  onUpdated: (user: AdminUser) => void;
}

export function AdminUserDrawer({ user, onClose, onUpdated }: AdminUserDrawerProps) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  if (!user) return null;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function patch(updates: Partial<AdminUser>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      const updated: AdminUser = await res.json();
      onUpdated(updated);
      showToast("Saved.");
    } catch {
      showToast("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  const initials = user.name
    ? user.name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="fixed right-0 top-0 h-full z-40 flex flex-col overflow-hidden"
        style={{
          width: 400,
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>User Detail</p>
          <button onClick={onClose} className="p-1.5 rounded" style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0"
              style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              {initials}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--text)" }}>
                {user.name ?? "—"}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user.email}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Forms", value: user.formCount },
              { label: "Responses", value: user.submissionCount },
            ].map((s) => (
              <div key={s.label} className="rounded-md p-3 text-center"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)" }}>
                <p className="text-xl font-bold font-syne" style={{ color: "var(--text)" }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-2">
            {[
              { label: "User ID", value: user.id, mono: true },
              { label: "Joined", value: formatDateTime(new Date(user.createdAt)) },
              { label: "Last updated", value: formatDate(new Date(user.updatedAt)) },
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4">
                <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{row.label}</span>
                <span
                  className={`text-xs text-right break-all ${row.mono ? "font-mono" : ""}`}
                  style={{ color: "var(--text)" }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border)" }} />

          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Role */}
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Role</p>
              <div className="flex gap-2">
                {["user", "admin"].map((r) => (
                  <button
                    key={r}
                    disabled={saving}
                    onClick={() => patch({ role: r })}
                    className="flex-1 py-2 rounded text-sm font-medium capitalize transition-colors disabled:opacity-40"
                    style={{
                      background: user.role === r ? "var(--accent-dim)" : "var(--surface-elevated)",
                      color: user.role === r ? "var(--accent)" : "var(--text-muted)",
                      border: `1px solid ${user.role === r ? "rgba(99,102,241,0.35)" : "var(--border)"}`,
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan */}
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Plan</p>
              <div className="flex gap-2">
                {["free", "pro"].map((p) => (
                  <button
                    key={p}
                    disabled={saving}
                    onClick={() => patch({ plan: p })}
                    className="flex-1 py-2 rounded text-sm font-medium capitalize transition-colors disabled:opacity-40"
                    style={{
                      background: user.plan === p ? "var(--accent-dim)" : "var(--surface-elevated)",
                      color: user.plan === p ? "var(--accent)" : "var(--text-muted)",
                      border: `1px solid ${user.plan === p ? "rgba(99,102,241,0.35)" : "var(--border)"}`,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Account active</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Inactive users cannot sign in or submit forms.
                </p>
              </div>
              <button
                role="switch"
                aria-checked={user.isActive}
                disabled={saving}
                onClick={() => patch({ isActive: !user.isActive })}
                className="relative w-9 h-5 rounded-full transition-colors shrink-0 disabled:opacity-40"
                style={{
                  background: user.isActive ? "var(--success)" : "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform"
                  style={{ transform: user.isActive ? "translateX(17px)" : "translateX(2px)" }}
                />
              </button>
            </div>
          </div>

          {/* Clerk link */}
          <a
            href={`https://dashboard.clerk.com/users/${user.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <ExternalLink size={12} />
            View in Clerk dashboard
          </a>
        </div>

        {/* Saving indicator */}
        {saving && (
          <div
            className="shrink-0 flex items-center gap-2 px-5 py-3"
            style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}
          >
            <Loader2 size={13} className="animate-spin" style={{ color: "var(--accent)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Saving…</span>
          </div>
        )}

        {toast && (
          <div
            className="fixed bottom-4 right-4 z-50 text-sm px-4 py-2 rounded"
            style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
