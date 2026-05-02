import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { forms, formSubmissions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id, sid } = await params;
  const db = getDb();

  // Verify the form belongs to this user
  const [form] = await db
    .select({ id: forms.id })
    .from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });

  // Delete the submission (field_responses cascade)
  const [deleted] = await db
    .delete(formSubmissions)
    .where(and(eq(formSubmissions.id, sid), eq(formSubmissions.formId, id)))
    .returning({ id: formSubmissions.id });

  if (!deleted) return Response.json({ error: "Submission not found" }, { status: 404 });

  return Response.json({ deleted: true });
}
