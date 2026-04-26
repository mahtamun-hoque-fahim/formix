import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = user.publicMetadata?.role as string | undefined;
  if (role !== "admin") redirect("/dashboard");
  return user;
}

export async function getRole(): Promise<"admin" | "user" | null> {
  const user = await currentUser();
  if (!user) return null;
  return (user.publicMetadata?.role as "admin" | "user") ?? "user";
}
