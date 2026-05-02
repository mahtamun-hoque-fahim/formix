import Link from "next/link";
import { Zap, Check, ArrowRight, Star, Users, Globe } from "lucide-react";
import { FeatureCards } from "@/components/landing/FeatureCards";

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14 border-b"
      style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      <span className="text-lg font-bold font-syne" style={{ color: "var(--text)" }}>
        Form<span style={{ color: "var(--accent)" }}>ify</span>
      </span>

      <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
        <a href="#features" className="hover:text-[--text] transition-colors">Features</a>
        <a href="#pricing" className="hover:text-[--text] transition-colors">Pricing</a>
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="text-sm px-4 py-1.5 rounded transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="text-sm px-4 py-1.5 rounded font-medium transition-colors"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Get started
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen pt-14 px-4 text-center overflow-hidden">
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
      />

      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-6 font-mono"
        style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.25)" }}
      >
        <Zap size={11} />
        Build · Share · Export
      </span>

      <h1
        className="text-5xl md:text-7xl font-bold font-syne leading-[1.05] mb-6 max-w-4xl"
        style={{ color: "var(--text)" }}
      >
        Forms that{" "}
        <span style={{ color: "var(--accent)" }}>actually work</span>
        {" "}for your team.
      </h1>

      <p
        className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        Create powerful forms, share them anywhere, and export responses in CSV,
        Excel, PDF, or JSON — with a builder designed to get out of your way.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
        <Link
          href="/sign-up"
          className="flex items-center gap-2 px-7 py-3.5 rounded font-semibold text-sm transition-all active:scale-[0.98]"
          style={{ background: "var(--accent)", color: "#fff", boxShadow: "0 0 24px rgba(99,102,241,0.3)" }}
        >
          Start for free
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/sign-in"
          className="px-7 py-3.5 rounded text-sm transition-colors border"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Sign in to dashboard
        </Link>
      </div>

      <div className="flex items-center gap-6 text-xs" style={{ color: "var(--text-disabled)" }}>
        {[
          { icon: <Users size={12} />, label: "Built for teams" },
          { icon: <Globe size={12} />, label: "16 field types" },
          { icon: <Star size={12} />, label: "Export to 4 formats" },
        ].map(({ icon, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            {icon}{label}
          </span>
        ))}
      </div>

      {/* Dashboard preview */}
      <div
        className="relative mt-16 w-full max-w-5xl rounded-xl overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          background: "var(--surface)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ borderColor: "var(--border)", background: "var(--surface-elevated)" }}
        >
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
          <span
            className="ml-4 text-xs font-mono px-3 py-0.5 rounded"
            style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            formify.vercel.app/dashboard
          </span>
        </div>

        <div className="flex min-h-[320px]">
          <div
            className="w-44 shrink-0 p-3 flex flex-col gap-1 border-r"
            style={{ borderColor: "var(--border)" }}
          >
            {["Dashboard", "My Forms", "Responses", "Settings"].map((item, i) => (
              <div
                key={item}
                className="text-xs px-3 py-2 rounded flex items-center gap-2"
                style={
                  i === 1
                    ? { color: "var(--accent)", background: "var(--accent-dim)" }
                    : { color: "var(--text-muted)" }
                }
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: i === 1 ? "var(--accent)" : "var(--border)" }} />
                {item}
              </div>
            ))}
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold font-syne" style={{ color: "var(--text)" }}>My Forms</span>
              <div className="text-xs px-3 py-1.5 rounded" style={{ background: "var(--accent)", color: "#fff" }}>
                + New Form
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Event Registration", responses: 142, status: "published" },
                { name: "Product Feedback", responses: 38, status: "published" },
                { name: "Team Survey Q2", responses: 0, status: "draft" },
                { name: "Volunteer Signup", responses: 67, status: "closed" },
              ].map(({ name, responses, status }) => (
                <div
                  key={name}
                  className="p-3 rounded-md"
                  style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{name}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-sm"
                      style={
                        status === "published"
                          ? { background: "rgba(34,197,94,0.1)", color: "#4ade80" }
                          : status === "draft"
                          ? { background: "rgba(245,158,11,0.1)", color: "#fbbf24" }
                          : { background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }
                      }
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{responses} responses</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-xs font-medium font-mono px-3 py-1 rounded-full inline-block mb-4"
            style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            Features
          </span>
          <h2 className="text-4xl font-bold font-syne mb-4" style={{ color: "var(--text)" }}>
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Formify is purpose-built for teams that need reliable data collection without the bloat.
          </p>
        </div>

        <FeatureCards />
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const freePlan = [
  "Up to 3 active forms",
  "100 responses / form",
  "All 16 field types",
  "CSV & JSON export",
  "Public form URL",
];

const proPlan = [
  "Unlimited active forms",
  "Unlimited responses",
  "All 16 field types",
  "CSV, JSON, XLSX & PDF export",
  "Email notifications on submit",
  "File upload fields (Cloudinary)",
  "Custom redirect & success message",
  "Response analytics & summaries",
  "Priority support",
];

function Pricing() {
  return (
    <section id="pricing" className="py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-xs font-medium font-mono px-3 py-1 rounded-full inline-block mb-4"
            style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            Pricing
          </span>
          <h2 className="text-4xl font-bold font-syne mb-4" style={{ color: "var(--text)" }}>
            Simple, honest pricing.
          </h2>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Free */}
          <div
            className="flex-1 p-7 rounded-xl flex flex-col"
          >
            <div className="mb-6">
              <p className="text-xs font-mono mb-2" style={{ color: "var(--text-muted)" }}>FREE</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold font-syne" style={{ color: "var(--text)" }}>$0</span>
                <span className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>/month</span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Perfect for getting started.</p>
            </div>
            <ul className="flex-1 space-y-3 mb-7">
              {freePlan.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  <Check size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="w-full text-center py-2.5 rounded text-sm font-medium transition-colors border"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div
            className="flex-1 p-7 rounded-xl flex flex-col relative overflow-hidden"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid rgba(99,102,241,0.4)",
              boxShadow: "0 0 40px rgba(99,102,241,0.1)",
            }}
          >
            <span
              className="absolute top-4 right-4 text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              POPULAR
            </span>
            <div className="mb-6">
              <p className="text-xs font-mono mb-2" style={{ color: "var(--accent)" }}>PRO</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold font-syne" style={{ color: "var(--text)" }}>$9</span>
                <span className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>/month</span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>For teams that need it all.</p>
            </div>
            <ul className="flex-1 space-y-3 mb-7">
              {proPlan.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  <Check size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="w-full text-center py-2.5 rounded text-sm font-semibold transition-all active:scale-[0.98]"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Start with Pro
            </Link>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-disabled)" }}>
          No credit card required to start · Cancel anytime
        </p>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-24 px-4">
      <div
        className="max-w-3xl mx-auto text-center rounded-xl px-8 py-16 relative overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(99,102,241,0.25)",
          boxShadow: "0 0 60px rgba(99,102,241,0.08)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)" }}
        />
        <h2 className="text-3xl md:text-4xl font-bold font-syne mb-4 relative" style={{ color: "var(--text)" }}>
          Ready to collect smarter responses?
        </h2>
        <p className="text-base mb-8 relative" style={{ color: "var(--text-muted)" }}>
          Join teams using Formify to run registrations, surveys, feedback forms, and more.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded font-semibold text-sm transition-all active:scale-[0.98] relative"
          style={{ background: "var(--accent)", color: "#fff", boxShadow: "0 0 24px rgba(99,102,241,0.35)" }}
        >
          Create your first form
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="border-t px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-3"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="text-sm font-bold font-syne" style={{ color: "var(--text)" }}>
        Form<span style={{ color: "var(--accent)" }}>ify</span>
      </span>
      <p className="text-xs" style={{ color: "var(--text-disabled)" }}>
        © {new Date().getFullYear()} Formify. Built by{" "}
        <a
          href="https://github.com/mahtamun-hoque-fahim"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: "var(--text-muted)" }}
        >
          MAHTAMUN
        </a>
        .
      </p>
      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
        <a href="#features" className="hover:text-[--text] transition-colors">Features</a>
        <a href="#pricing" className="hover:text-[--text] transition-colors">Pricing</a>
        <Link href="/sign-in" className="hover:text-[--text] transition-colors">Sign in</Link>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <CTABanner />
      <Footer />
    </main>
  );
}
