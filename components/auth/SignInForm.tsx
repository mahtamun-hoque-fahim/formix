"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";

interface Props {
  mode?: "signin" | "signup";
}

export function SignInForm({ mode = "signin" }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await signIn("resend", { email, redirect: false });
      if (res?.error) {
        setError("Failed to send link. Check your email and try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(34,197,94,0.1)" }}
        >
          <CheckCircle size={22} style={{ color: "var(--success)" }} />
        </div>
        <h2 className="text-lg font-semibold font-syne mb-2" style={{ color: "var(--text)" }}>
          Check your inbox
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          We sent a sign-in link to <strong style={{ color: "var(--text)" }}>{email}</strong>.
          <br />Click it to continue — no password needed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-7">
        <h1 className="text-xl font-bold font-syne mb-1.5" style={{ color: "var(--text)" }}>
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {mode === "signup"
            ? "Enter your email to get started — no password needed."
            : "Enter your email and we'll send a sign-in link."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-9 pr-4 py-2.5 rounded text-sm outline-none transition-colors"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {error && (
          <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 rounded text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              {mode === "signup" ? "Continue" : "Send sign-in link"}
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
