import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { forms, formFields } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const db = getDb();
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });

  const { orderedIds } = await req.json() as { orderedIds: string[] };

  await Promise.all(
    orderedIds.map((fieldId, index) =>
      db.update(formFields).set({ order: index }).where(eq(formFields.id, fieldId))
    )
  );

  return Response.json({ ok: true });
}
