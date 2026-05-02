"use client";

import { LayoutGrid, Share2, FileDown, ShieldCheck, BarChart3, FormInput } from "lucide-react";

const features = [
  {
    icon: <LayoutGrid size={20} />,
    title: "Drag-and-drop builder",
    description: "16 field types. Drag, drop, configure. Build any form in minutes without touching code.",
  },
  {
    icon: <Share2 size={20} />,
    title: "Share anywhere",
    description: "Every form gets a clean public URL. Share on email, Slack, socials — no signup required for respondents.",
  },
  {
    icon: <FileDown size={20} />,
    title: "Export in 4 formats",
    description: "Download responses as CSV, JSON, Excel (XLSX), or a dark-themed PDF report — one click.",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Response analytics",
    description: "Visual summaries per field: bar charts, star distributions, averages. See patterns instantly.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Access control",
    description: "Require auth, cap submissions, set start/end dates, limit to one response per user.",
  },
  {
    icon: <FormInput size={20} />,
    title: "Custom field logic",
    description: "Required fields, placeholders, help text, choice lists, file uploads — all configurable per field.",
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map(({ icon, title, description }) => (
        <div
          key={title}
          className="p-5 rounded-md transition-all"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.3)";
            (e.currentTarget as HTMLDivElement).style.background = "var(--surface-elevated)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
          }}
        >
          <div
            className="w-9 h-9 rounded flex items-center justify-center mb-4"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            {icon}
          </div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
        </div>
      ))}
    </div>
  );
}
