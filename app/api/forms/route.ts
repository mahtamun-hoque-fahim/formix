import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const userForms = await db.select().from(forms)
    .where(eq(forms.userId, userId))
    .orderBy(forms.createdAt);

  return Response.json(userForms);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description } = body;

  if (!title?.trim()) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const db = getDb();
  const slug = generateSlug(title);

  const [form] = await db.insert(forms).values({
    userId,
    title: title.trim(),
    description: description?.trim() || null,
    slug,
  }).returning();

  return Response.json(form, { status: 201 });
}
