import { getAuthUserId } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { forms, formFields } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { FIELD_DEFINITIONS } from "@/lib/field-types";

async function verifyOwnership(userId: string, formId: string) {
  const db = getDb();
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)));
  return form;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!await verifyOwnership(userId, id)) return Response.json({ error: "Not found" }, { status: 404 });

  const db = getDb();
  const fields = await db.select().from(formFields)
    .where(eq(formFields.formId, id))
    .orderBy(formFields.order);

  return Response.json(fields);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!await verifyOwnership(userId, id)) return Response.json({ error: "Not found" }, { status: 404 });

  const db = getDb();
  const body = await req.json();
  const { type } = body;

  const def = FIELD_DEFINITIONS.find(d => d.type === type);
  if (!def) return Response.json({ error: "Invalid field type" }, { status: 400 });

  // Get current max order
  const existing = await db.select().from(formFields).where(eq(formFields.formId, id));
  const maxOrder = existing.reduce((m, f) => Math.max(m, f.order), -1);

  const defaultOptions = def.hasOptions ? { choices: ["Option 1", "Option 2"] } :
    type === "rating" ? { min: 1, max: 5 } : null;

  const [field] = await db.insert(formFields).values({
    formId: id,
    type,
    label: body.label ?? def.defaultLabel,
    placeholder: body.placeholder ?? null,
    helpText: body.helpText ?? null,
    isRequired: body.isRequired ?? false,
    order: maxOrder + 1,
    options: defaultOptions,
  }).returning();

  return Response.json(field, { status: 201 });
}
