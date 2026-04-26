export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>
            Form<span style={{ color: "var(--accent)" }}>ix</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
