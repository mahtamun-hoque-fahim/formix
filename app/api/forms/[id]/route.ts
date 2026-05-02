import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function getOwnedForm(userId: string, formId: string) {
  const db = getDb();
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)));
  return form;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const form = await getOwnedForm(userId, id);
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(form);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const form = await getOwnedForm(userId, id);
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });

  const db = getDb();
  const body = await req.json();
  const { title, description, successMessage, redirectUrl, allowMultipleSubmissions, requireAuth, submissionLimit, notifyOnSubmission, accentColor } = body;

  const [updated] = await db.update(forms).set({
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(successMessage !== undefined && { successMessage }),
    ...(redirectUrl !== undefined && { redirectUrl }),
    ...(allowMultipleSubmissions !== undefined && { allowMultipleSubmissions }),
    ...(requireAuth !== undefined && { requireAuth }),
    ...(submissionLimit !== undefined && { submissionLimit }),
    ...(notifyOnSubmission !== undefined && { notifyOnSubmission }),
    ...(accentColor !== undefined && { accentColor }),
    updatedAt: new Date(),
  }).where(eq(forms.id, id)).returning();

  return Response.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const form = await getOwnedForm(userId, id);
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });

  const db = getDb();
  await db.delete(forms).where(eq(forms.id, id));
  return Response.json({ ok: true });
}
