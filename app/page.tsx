import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="text-center max-w-2xl">
        <span className="text-xs font-medium px-2 py-0.5 rounded-sm border font-mono mb-6 inline-block"
          style={{ background: "var(--accent-dim)", color: "var(--accent)", borderColor: "rgba(99,102,241,0.2)" }}>
          Form SaaS
        </span>
        <h1 className="text-5xl font-bold font-syne mt-4 mb-4 leading-tight" style={{ color: "var(--text)" }}>
          Build forms.<br />Collect responses.<br />
          <span style={{ color: "var(--accent)" }}>Export anything.</span>
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
          Create powerful forms for your organization or event. Share, collect, and export responses in CSV, Excel, PDF, or JSON.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/sign-up"
            className="px-6 py-3 rounded font-semibold text-sm transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}>
            Get Started Free
          </Link>
          <Link href="/sign-in"
            className="px-6 py-3 rounded text-sm transition-colors border"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
