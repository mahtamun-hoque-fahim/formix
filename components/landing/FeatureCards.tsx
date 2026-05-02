"use client";

import { LayoutGrid, Share2, FileDown, ShieldCheck, BarChart3, FormInput } from "lucide-react";
import { useState } from "react";

const features = [
  { icon: <LayoutGrid size={20} />, title: "Drag-and-drop builder", description: "16 field types. Drag, drop, configure. Build any form in minutes without touching code." },
  { icon: <Share2 size={20} />, title: "Share anywhere", description: "Every form gets a clean public URL. Share on email, Slack, socials — no signup required for respondents." },
  { icon: <FileDown size={20} />, title: "Export in 4 formats", description: "Download responses as CSV, JSON, Excel (XLSX), or a dark-themed PDF report — one click." },
  { icon: <BarChart3 size={20} />, title: "Response analytics", description: "Visual summaries per field: bar charts, star distributions, averages. See patterns instantly." },
  { icon: <ShieldCheck size={20} />, title: "Access control", description: "Require auth, cap submissions, set start/end dates, limit to one response per user." },
  { icon: <FormInput size={20} />, title: "Custom field logic", description: "Required fields, placeholders, help text, choice lists, file uploads — all configurable per field." },
];

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "1.25rem", borderRadius: "6px", transition: "all 0.15s",
        background: hovered ? "var(--surface-elevated)" : "var(--surface)",
        border: `1px solid ${hovered ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
      }}
    >
      <div style={{
        width: "36px", height: "36px", borderRadius: "6px", marginBottom: "1rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--accent-dim)", color: "var(--accent)",
      }}>{icon}</div>
      <h3 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text)" }}>{title}</h3>
      <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-muted)" }}>{description}</p>
    </div>
  );
}

export function FeatureCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
      {features.map((f) => <FeatureCard key={f.title} {...f} />)}
    </div>
  );
}
