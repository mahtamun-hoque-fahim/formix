import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "accent" | "success" | "warning" | "destructive" | "info";
  children: React.ReactNode;
  className?: string;
}

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  default: { background: "var(--surface-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" },
  accent: { background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)" },
  success: { background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" },
  warning: { background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" },
  destructive: { background: "var(--destructive-dim)", color: "var(--destructive)", border: "1px solid rgba(239,68,68,0.2)" },
  info: { background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" },
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn("text-xs font-medium px-2 py-0.5 rounded-sm", className)}
      style={BADGE_STYLES[variant]}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" | "closed" }) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    draft: { label: "Draft", variant: "warning" },
    published: { label: "Published", variant: "success" },
    closed: { label: "Closed", variant: "default" },
  };
  const { label, variant } = map[status] ?? map.draft;
  return <Badge variant={variant}>{label}</Badge>;
}
