import { requireAuth } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SettingsClient } from "@/components/settings/SettingsClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Form Settings" };

export default async function SettingsPage({ params }: Props) {
  const userId = await requireAuth();
  const { id } = await params;
  const db = getDb();

  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));

  if (!form) notFound();

  return <SettingsClient form={form} />;
}
