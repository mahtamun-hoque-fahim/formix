import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import { getDb } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      from: process.env.RESEND_FROM_EMAIL ?? "auth@oneformify.vercel.app",
      name: "Formify",
    }),
  ],
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/sign-in/verify",
    error: "/sign-in",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        (session.user as typeof session.user & { role: string; plan: string }).role =
          (user as typeof user & { role: string }).role ?? "user";
        (session.user as typeof session.user & { role: string; plan: string }).plan =
          (user as typeof user & { plan: string }).plan ?? "free";
      }
      return session;
    },
  },
});
