import { requireAdmin } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  await requireAdmin();
  const { uid } = await params;
  const body = await req.json();
  const db = getDb();

  const allowed = ["role", "plan", "isActive"] as const;
  const updates: Partial<typeof users.$inferInsert> = {};

  for (const key of allowed) {
    if (key in body) {
      (updates as Record<string, unknown>)[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const [updated] = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, uid))
    .returning();

  if (!updated) return Response.json({ error: "User not found." }, { status: 404 });

  return Response.json(updated);
}
