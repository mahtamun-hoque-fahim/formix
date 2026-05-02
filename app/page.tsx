import Link from "next/link";
import { Zap, Check, ArrowRight, Star, Users, Globe } from "lucide-react";
import { FeatureCards } from "@/components/landing/FeatureCards";

function Navbar() {
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 3rem", height: "56px",
      background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-syne)", color: "var(--text)" }}>
        Form<span style={{ color: "var(--accent)" }}>ify</span>
      </span>

      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <a href="#features" style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "none" }}>Features</a>
        <a href="#pricing" style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "none" }}>Pricing</a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link href="/sign-in" style={{ fontSize: "0.875rem", padding: "0.375rem 1rem", borderRadius: "6px", color: "var(--text-muted)", textDecoration: "none" }}>
          Sign in
        </Link>
        <Link href="/sign-up" style={{ fontSize: "0.875rem", padding: "0.375rem 1rem", borderRadius: "6px", fontWeight: 600, background: "var(--accent)", color: "#fff", textDecoration: "none" }}>
          Get started
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{
      position: "relative", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "100vh", paddingTop: "56px", padding: "56px 1rem 4rem",
      textAlign: "center", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: "33%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "600px", borderRadius: "9999px",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Badge */}
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "0.375rem",
        fontSize: "0.75rem", fontWeight: 500, fontFamily: "var(--font-jetbrains-mono)",
        padding: "0.25rem 0.75rem", borderRadius: "9999px", marginBottom: "1.5rem",
        background: "var(--accent-dim)", color: "var(--accent)",
        border: "1px solid rgba(99,102,241,0.25)",
      }}>
        <Zap size={11} />
        Build · Share · Export
      </span>

      {/* Headline */}
      <h1 style={{
        fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
        fontWeight: 700, fontFamily: "var(--font-syne)",
        lineHeight: 1.05, marginBottom: "1.5rem",
        maxWidth: "56rem", color: "var(--text)",
      }}>
        Forms that{" "}
        <span style={{ color: "var(--accent)" }}>actually work</span>
        {" "}for your team.
      </h1>

      {/* Subheading */}
      <p style={{
        fontSize: "1.125rem", maxWidth: "40rem", marginBottom: "2.5rem",
        lineHeight: 1.6, color: "var(--text-muted)",
      }}>
        Create powerful forms, share them anywhere, and export responses in CSV,
        Excel, PDF, or JSON — with a builder designed to get out of your way.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" }}>
        <Link href="/sign-up" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.875rem 1.75rem", borderRadius: "6px",
          fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
          background: "var(--accent)", color: "#fff",
          boxShadow: "0 0 24px rgba(99,102,241,0.3)",
        }}>
          Start for free <ArrowRight size={15} />
        </Link>
        <Link href="/sign-in" style={{
          padding: "0.875rem 1.75rem", borderRadius: "6px",
          fontSize: "0.875rem", textDecoration: "none",
          border: "1px solid var(--border)", color: "var(--text-muted)",
        }}>
          Sign in to dashboard
        </Link>
      </div>

      {/* Social proof */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.75rem", color: "var(--text-disabled)", marginBottom: "3rem" }}>
        {[
          { icon: <Users size={12} />, label: "Built for teams" },
          { icon: <Globe size={12} />, label: "16 field types" },
          { icon: <Star size={12} />, label: "Export to 4 formats" },
        ].map(({ icon, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            {icon}{label}
          </span>
        ))}
      </div>

      {/* Dashboard preview */}
      <div style={{
        width: "100%", maxWidth: "900px", borderRadius: "12px", overflow: "hidden",
        border: "1px solid var(--border)", background: "var(--surface)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Window bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)",
          background: "var(--surface-elevated)",
        }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(239,68,68,0.6)" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(245,158,11,0.6)" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(34,197,94,0.6)" }} />
          <span style={{
            marginLeft: "1rem", fontSize: "0.75rem", fontFamily: "var(--font-jetbrains-mono)",
            padding: "0.125rem 0.75rem", borderRadius: "4px",
            background: "var(--surface)", color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}>
            oneformify.vercel.app/dashboard
          </span>
        </div>

        {/* Mock dashboard */}
        <div style={{ display: "flex", minHeight: "280px" }}>
          <div style={{
            width: "160px", flexShrink: 0, padding: "0.75rem",
            display: "flex", flexDirection: "column", gap: "0.25rem",
            borderRight: "1px solid var(--border)",
          }}>
            {["Dashboard", "My Forms", "Responses", "Settings"].map((item, i) => (
              <div key={item} style={{
                fontSize: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: "4px",
                display: "flex", alignItems: "center", gap: "0.5rem",
                color: i === 1 ? "var(--accent)" : "var(--text-muted)",
                background: i === 1 ? "var(--accent-dim)" : "transparent",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 1 ? "var(--accent)" : "var(--border)", flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, fontFamily: "var(--font-syne)", color: "var(--text)" }}>My Forms</span>
              <div style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem", borderRadius: "4px", background: "var(--accent)", color: "#fff" }}>+ New Form</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { name: "Event Registration", responses: 142, status: "published" },
                { name: "Product Feedback", responses: 38, status: "published" },
                { name: "Team Survey Q2", responses: 0, status: "draft" },
                { name: "Volunteer Signup", responses: 67, status: "closed" },
              ].map(({ name, responses, status }) => (
                <div key={name} style={{
                  padding: "0.75rem", borderRadius: "6px",
                  background: "var(--surface-elevated)", border: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text)" }}>{name}</span>
                    <span style={{
                      fontSize: "0.625rem", padding: "0.125rem 0.375rem", borderRadius: "3px",
                      background: status === "published" ? "rgba(34,197,94,0.1)" : status === "draft" ? "rgba(245,158,11,0.1)" : "var(--surface)",
                      color: status === "published" ? "#4ade80" : status === "draft" ? "#fbbf24" : "var(--text-muted)",
                      border: status === "closed" ? "1px solid var(--border)" : "none",
                    }}>{status}</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{responses} responses</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" style={{ padding: "7rem 1rem" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{
            fontSize: "0.75rem", fontWeight: 500, fontFamily: "var(--font-jetbrains-mono)",
            padding: "0.25rem 0.75rem", borderRadius: "9999px", display: "inline-block", marginBottom: "1rem",
            background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)",
          }}>Features</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 700, fontFamily: "var(--font-syne)", marginBottom: "1rem", color: "var(--text)" }}>
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
          <p style={{ fontSize: "1rem", maxWidth: "36rem", margin: "0 auto", color: "var(--text-muted)" }}>
            Formify is purpose-built for teams that need reliable data collection without the bloat.
          </p>
        </div>
        <FeatureCards />
      </div>
    </section>
  );
}

const freePlan = ["Up to 3 active forms", "100 responses / form", "All 16 field types", "CSV & JSON export", "Public form URL"];
const proPlan = ["Unlimited active forms", "Unlimited responses", "All 16 field types", "CSV, JSON, XLSX & PDF export", "Email notifications on submit", "File upload fields (Cloudinary)", "Custom redirect & success message", "Response analytics & summaries", "Priority support"];

function Pricing() {
  return (
    <section id="pricing" style={{ padding: "7rem 1rem" }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{
            fontSize: "0.75rem", fontWeight: 500, fontFamily: "var(--font-jetbrains-mono)",
            padding: "0.25rem 0.75rem", borderRadius: "9999px", display: "inline-block", marginBottom: "1rem",
            background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)",
          }}>Pricing</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 700, fontFamily: "var(--font-syne)", marginBottom: "1rem", color: "var(--text)" }}>
            Simple, honest pricing.
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)" }}>Start free. Upgrade when you need more.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Free */}
          <div style={{ padding: "1.75rem", borderRadius: "12px", display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-jetbrains-mono)", marginBottom: "0.5rem", color: "var(--text-muted)" }}>FREE</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.25rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "var(--font-syne)", color: "var(--text)" }}>$0</span>
                <span style={{ fontSize: "0.875rem", marginBottom: "0.25rem", color: "var(--text-muted)" }}>/month</span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Perfect for getting started.</p>
            </div>
            <ul style={{ flex: 1, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
              {freePlan.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <Check size={14} style={{ color: "var(--success)", flexShrink: 0 }} />{item}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" style={{
              display: "block", textAlign: "center", padding: "0.625rem", borderRadius: "6px",
              fontSize: "0.875rem", fontWeight: 500, textDecoration: "none",
              border: "1px solid var(--border)", color: "var(--text)",
            }}>Get started free</Link>
          </div>

          {/* Pro */}
          <div style={{
            padding: "1.75rem", borderRadius: "12px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
            background: "var(--surface-elevated)", border: "1px solid rgba(99,102,241,0.4)",
            boxShadow: "0 0 40px rgba(99,102,241,0.1)",
          }}>
            <span style={{
              position: "absolute", top: "1rem", right: "1rem",
              fontSize: "0.625rem", fontWeight: 600, fontFamily: "var(--font-jetbrains-mono)",
              padding: "0.125rem 0.5rem", borderRadius: "9999px",
              background: "var(--accent)", color: "#fff",
            }}>POPULAR</span>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-jetbrains-mono)", marginBottom: "0.5rem", color: "var(--accent)" }}>PRO</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.25rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "var(--font-syne)", color: "var(--text)" }}>$9</span>
                <span style={{ fontSize: "0.875rem", marginBottom: "0.25rem", color: "var(--text-muted)" }}>/month</span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>For teams that need it all.</p>
            </div>
            <ul style={{ flex: 1, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
              {proPlan.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <Check size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />{item}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" style={{
              display: "block", textAlign: "center", padding: "0.625rem", borderRadius: "6px",
              fontSize: "0.875rem", fontWeight: 600, textDecoration: "none",
              background: "var(--accent)", color: "#fff",
            }}>Start with Pro</Link>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", marginTop: "1.5rem", color: "var(--text-disabled)" }}>
          No credit card required to start · Cancel anytime
        </p>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section style={{ padding: "5rem 1rem" }}>
      <div style={{
        maxWidth: "48rem", margin: "0 auto", textAlign: "center",
        padding: "4rem 2rem", borderRadius: "12px", position: "relative", overflow: "hidden",
        background: "var(--surface)", border: "1px solid rgba(99,102,241,0.25)",
        boxShadow: "0 0 60px rgba(99,102,241,0.08)",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)",
        }} />
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, fontFamily: "var(--font-syne)", marginBottom: "1rem", color: "var(--text)", position: "relative" }}>
          Ready to collect smarter responses?
        </h2>
        <p style={{ fontSize: "1rem", marginBottom: "2rem", color: "var(--text-muted)", position: "relative" }}>
          Join teams using Formify to run registrations, surveys, feedback forms, and more.
        </p>
        <Link href="/sign-up" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.875rem 2rem", borderRadius: "6px",
          fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", position: "relative",
          background: "var(--accent)", color: "#fff",
          boxShadow: "0 0 24px rgba(99,102,241,0.35)",
        }}>
          Create your first form <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)", padding: "2rem 3rem",
      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
    }}>
      <span style={{ fontSize: "0.875rem", fontWeight: 700, fontFamily: "var(--font-syne)", color: "var(--text)" }}>
        Form<span style={{ color: "var(--accent)" }}>ify</span>
      </span>
      <p style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>
        © {new Date().getFullYear()} Formify. Built by{" "}
        <a href="https://github.com/mahtamun-hoque-fahim" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          MAHTAMUN
        </a>.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <a href="#features" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}>Features</a>
        <a href="#pricing" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}>Pricing</a>
        <Link href="/sign-in" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}>Sign in</Link>
      </div>
    </footer>
  );
}

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
