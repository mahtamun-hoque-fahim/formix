import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/api/submissions",
  "/api/forms/slug",
  "/api/webhooks",
  "/f/",
  "/og",
];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const path = nextUrl.pathname;

  const isPublic = publicPaths.some((p) => path === p || path.startsWith(p));
  if (isPublic) return NextResponse.next();

  if (!session?.user) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  // Admin guard
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    const role = (session.user as typeof session.user & { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
