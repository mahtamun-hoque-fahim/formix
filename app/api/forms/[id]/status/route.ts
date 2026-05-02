import { getAuthUserId } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();

  if (!["draft", "published", "closed"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const db = getDb();
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });

  const [updated] = await db.update(forms).set({ status, updatedAt: new Date() })
    .where(eq(forms.id, id)).returning();

  return Response.json(updated);
}
