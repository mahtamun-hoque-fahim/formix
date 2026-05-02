import Link from "next/link";
import { MailCheck } from "lucide-react";

export const metadata = { title: "Check your email" };

export default function VerifyPage() {
  return (
    <div className="text-center py-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "var(--accent-dim)" }}
      >
        <MailCheck size={22} style={{ color: "var(--accent)" }} />
      </div>
      <h1 className="text-lg font-bold font-syne mb-2" style={{ color: "var(--text)" }}>
        Check your email
      </h1>
      <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
        A sign-in link has been sent to your inbox.<br />
        Click the link to access your account.
      </p>
      <Link
        href="/sign-in"
        className="text-xs"
        style={{ color: "var(--accent)" }}
      >
        ← Back to sign in
      </Link>
    </div>
  );
}
