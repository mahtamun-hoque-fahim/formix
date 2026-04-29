// Skeleton loader primitives — used across dashboard Suspense boundaries

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "var(--surface-elevated)", ...style }}
    />
  );
}

// ─── Dashboard overview skeleton ─────────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="p-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-md"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <Skeleton className="h-4 w-36 mb-4" />
      <div
        className="rounded-md overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < 4 ? "1px solid var(--border-muted)" : "none" }}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded" />
              <div>
                <Skeleton className="h-3 w-40 mb-1.5" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Forms list skeleton ──────────────────────────────────────────────────────

export function FormsListSkeleton() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-32 rounded" />
      </div>

      {/* Table */}
      <div
        className="rounded-md overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Thead */}
        <div
          className="flex items-center px-4 py-3 gap-4"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
        >
          {[180, 80, 80, 100, 80].map((w, i) => (
            <Skeleton key={i} style={{ height: "10px", width: `${w}px` }} />
          ))}
        </div>

        {/* Rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center px-4 py-3.5 gap-4"
            style={{ borderBottom: i < 5 ? "1px solid var(--border-muted)" : "none" }}
          >
            <Skeleton style={{ height: "12px", width: "180px" }} />
            <Skeleton style={{ height: "20px", width: "72px", borderRadius: "4px" }} />
            <Skeleton style={{ height: "12px", width: "60px" }} />
            <Skeleton style={{ height: "12px", width: "90px" }} />
            <Skeleton style={{ height: "12px", width: "60px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Builder skeleton ─────────────────────────────────────────────────────────

export function BuilderSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Palette */}
      <div
        className="w-56 shrink-0 p-4 flex flex-col gap-2"
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
      >
        <Skeleton className="h-3 w-20 mb-2" />
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded" />
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-28 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-md"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-9 w-full rounded" />
          </div>
        ))}
      </div>

      {/* Editor panel */}
      <div
        className="w-72 shrink-0 p-5 flex flex-col gap-4"
        style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}
      >
        <Skeleton className="h-4 w-28 mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-9 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Responses skeleton ───────────────────────────────────────────────────────

export function ResponsesSkeleton() {
  return (
    <div className="p-8">
      {/* Tabs + actions */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-9 w-48 rounded-md" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded" />
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-md overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center px-4 py-3 gap-6"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
        >
          {[60, 140, 120, 100].map((w, i) => (
            <Skeleton key={i} style={{ height: "10px", width: `${w}px` }} />
          ))}
        </div>
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex items-center px-4 py-3.5 gap-6"
            style={{ borderBottom: i < 6 ? "1px solid var(--border-muted)" : "none" }}
          >
            <Skeleton style={{ height: "12px", width: "60px" }} />
            <Skeleton style={{ height: "12px", width: "140px" }} />
            <Skeleton style={{ height: "12px", width: "110px" }} />
            <Skeleton style={{ height: "12px", width: "90px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings skeleton ────────────────────────────────────────────────────────

export function SettingsSkeleton() {
  return (
    <div className="p-8 max-w-2xl">
      <Skeleton className="h-6 w-28 mb-6" />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="mb-6 p-5 rounded-md"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-3 w-64 mb-3" />
          <Skeleton className="h-9 w-full rounded" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton };
