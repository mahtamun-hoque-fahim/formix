"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html>
      <body style={{ background: "#0a0a0a", color: "#f5f5f5", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              background: "#111111",
              border: "1px solid #1f1f1f",
              borderRadius: "12px",
              padding: "2.5rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <AlertTriangle size={22} color="#ef4444" />
            </div>
            <h1 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#888888", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              An unexpected error occurred. Please try again or refresh the page.
            </p>
            {error.digest && (
              <p
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  color: "#3d3d3d",
                  marginBottom: "1.25rem",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} />
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
