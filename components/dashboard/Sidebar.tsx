"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const userNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Forms", href: "/dashboard/forms", icon: FileText },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: Shield },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "All Forms", href: "/admin/forms", icon: FileText },
];

interface SidebarProps {
  role?: "admin" | "user";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  function NavLink({ item }: { item: NavItem }) {
    const isActive = item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

    return (
      <Link
        href={item.href}
        className={cn("flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors")}
        style={{
          color: isActive ? "var(--accent)" : "var(--text-muted)",
          background: isActive ? "var(--accent-dim)" : "transparent",
        }}
      >
        <item.icon size={16} />
        {item.label}
      </Link>
    );
  }

  return (
    <aside
      className="w-56 min-h-screen flex flex-col py-6 px-3 shrink-0"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="px-3 mb-8">
        <Link href="/dashboard" className="text-xl font-bold font-syne" style={{ color: "var(--text)" }}>
          Form<span style={{ color: "var(--accent)" }}>ify</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {userNav.map((item) => <NavLink key={item.href} item={item} />)}

        {role === "admin" && (
          <>
            <div className="my-3" style={{ borderTop: "1px solid var(--border)" }} />
            {adminNav.map((item) => <NavLink key={item.href} item={item} />)}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 flex items-center gap-2.5">
        <UserButton appearance={{
          variables: { colorPrimary: "#6366f1" },
        }} />
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Account</span>
      </div>
    </aside>
  );
}
