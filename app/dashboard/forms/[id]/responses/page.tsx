import { requireAuth } from "@/lib/clerk";
import { getDb } from "@/lib/db";
import { forms, formFields, formSubmissions, fieldResponses } from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ResponsesClient } from "@/components/responses/ResponsesClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Responses" };

export default async function ResponsesPage({ params }: Props) {
  const userId = await requireAuth();
  const { id } = await params;
  const db = getDb();

  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, userId)));
  if (!form) notFound();

  const fields = await db
    .select()
    .from(formFields)
    .where(eq(formFields.formId, id))
    .orderBy(formFields.order);

  const submissions = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.formId, id))
    .orderBy(desc(formSubmissions.submittedAt));

  // Bulk load all field responses
  const submissionIds = submissions.map((s) => s.id);
  const allResponses =
    submissionIds.length > 0
      ? await db
          .select()
          .from(fieldResponses)
          .where(inArray(fieldResponses.submissionId, submissionIds))
      : [];

  // Build nested map: submissionId → fieldId → value  (plain object for serialisation)
  const responseMap: Record<string, Record<string, string>> = {};
  for (const r of allResponses) {
    if (!responseMap[r.submissionId]) responseMap[r.submissionId] = {};
    responseMap[r.submissionId][r.fieldId] = r.value ?? "";
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <ResponsesClient
      form={form}
      fields={fields}
      initialSubmissions={submissions}
      initialResponseMap={responseMap}
      appUrl={appUrl}
    />
  );
}
