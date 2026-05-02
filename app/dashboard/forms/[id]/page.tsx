import { requireAuth } from "@/lib/auth-helpers";
import { getDb } from "@/lib/db";
import { forms, formFields } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BuilderClient } from "@/components/builder/BuilderClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const [form] = await db.select({ title: forms.title }).from(forms).where(eq(forms.id, id));
  return { title: form?.title ?? "Form Builder" };
}

export default async function BuilderPage({ params }: Props) {
  const userId = await requireAuth();
  const { id } = await params;
  const db = getDb();

  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));

  if (!form) notFound();

  const fields = await db.select().from(formFields)
    .where(eq(formFields.formId, id))
    .orderBy(formFields.order);

  return <BuilderClient form={form} initialFields={fields} />;
}
