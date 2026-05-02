import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// For Server Components / layouts — redirects if not authed
export async function requireAuth(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  return session.user.id;
}

// For API routes — returns null instead of redirecting
export async function getAuthUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const role = (session.user as typeof session.user & { role?: string }).role;
  if (role !== "admin") redirect("/dashboard");
  return session.user;
}

export async function getRole(): Promise<"admin" | "user" | null> {
  const session = await auth();
  if (!session?.user) return null;
  return ((session.user as typeof session.user & { role?: string }).role as "admin" | "user") ?? "user";
}
