import { getDb } from "@/lib/db";
import { forms, formFields } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = getDb();

  const [form] = await db.select().from(forms).where(eq(forms.slug, slug));
  if (!form) return Response.json({ error: "Not found" }, { status: 404 });
  if (form.status !== "published") {
    return Response.json({ error: "Form is not published" }, { status: 403 });
  }

  const fields = await db.select().from(formFields)
    .where(eq(formFields.formId, form.id))
    .orderBy(formFields.order);

  return Response.json({ form, fields });
}
