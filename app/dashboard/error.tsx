"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div
      className="flex-1 flex items-center justify-center p-8"
      style={{ minHeight: "60vh" }}
    >
      <div
        className="max-w-sm w-full text-center rounded-xl p-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--destructive-dim)" }}
        >
          <AlertTriangle size={20} style={{ color: "var(--destructive)" }} />
        </div>

        <h2
          className="text-base font-semibold font-syne mb-2"
          style={{ color: "var(--text)" }}
        >
          Something went wrong
        </h2>
        <p
          className="text-sm mb-5 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {error.message || "An unexpected error occurred loading this page."}
        </p>
        {error.digest && (
          <p
            className="text-[11px] font-mono mb-4"
            style={{ color: "var(--text-disabled)" }}
          >
            ID: {error.digest}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-sm font-medium transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <RotateCcw size={13} />
            Retry
          </button>
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-sm transition-colors border"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <Home size={13} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
