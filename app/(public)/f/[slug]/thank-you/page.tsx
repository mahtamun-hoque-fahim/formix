import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thank You" };

export default function ThankYouPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          ✓
        </div>
        <h1
          className="text-2xl font-bold font-syne mb-2"
          style={{ color: "var(--text)" }}
        >
          Thank you!
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Your response has been recorded.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 text-xs"
          style={{ color: "var(--text-disabled)" }}
        >
          Powered by Formify
        </Link>
      </div>
    </main>
  );
}
