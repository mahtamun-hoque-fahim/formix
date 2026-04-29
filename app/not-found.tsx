import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="max-w-sm w-full text-center rounded-xl p-10"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "var(--accent-dim)" }}
        >
          <FileQuestion size={22} style={{ color: "var(--accent)" }} />
        </div>

        <h1
          className="text-xl font-bold font-syne mb-2"
          style={{ color: "var(--text)" }}
        >
          Page not found
        </h1>
        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="w-full py-2.5 rounded text-sm font-medium text-center transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="w-full py-2.5 rounded text-sm text-center transition-colors border"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
