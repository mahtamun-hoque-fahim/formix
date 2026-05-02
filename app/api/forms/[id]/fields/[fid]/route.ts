import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { forms, formFields } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function verifyOwnership(userId: string, formId: string) {
  const db = getDb();
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)));
  return form;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; fid: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id, fid } = await params;
  if (!await verifyOwnership(userId, id)) return Response.json({ error: "Not found" }, { status: 404 });

  const db = getDb();
  const body = await req.json();
  const { label, placeholder, helpText, isRequired, options } = body;

  const [updated] = await db.update(formFields).set({
    ...(label !== undefined && { label }),
    ...(placeholder !== undefined && { placeholder }),
    ...(helpText !== undefined && { helpText }),
    ...(isRequired !== undefined && { isRequired }),
    ...(options !== undefined && { options }),
  }).where(eq(formFields.id, fid)).returning();

  return Response.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; fid: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id, fid } = await params;
  if (!await verifyOwnership(userId, id)) return Response.json({ error: "Not found" }, { status: 404 });

  const db = getDb();
  await db.delete(formFields).where(eq(formFields.id, fid));
  return Response.json({ ok: true });
}
