import { getDb } from "@/lib/db";
import { forms, formFields } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const [form] = await db.select({ title: forms.title, description: forms.description })
    .from(forms).where(eq(forms.slug, slug));
  return {
    title: form?.title ?? "Form",
    description: form?.description ?? undefined,
  };
}

export default async function PublicFormPage({ params }: Props) {
  const { slug } = await params;
  const db = getDb();

  const [form] = await db.select().from(forms).where(eq(forms.slug, slug));
  if (!form || form.status !== "published") notFound();

  const fields = await db.select().from(formFields)
    .where(eq(formFields.formId, form.id))
    .orderBy(formFields.order);

  return (
    <main
      className="min-h-screen flex items-start justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-xl rounded-lg p-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-syne mb-2" style={{ color: "var(--text)" }}>
            {form.title}
          </h1>
          {form.description && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {form.description}
            </p>
          )}
        </div>

        {/* Fields placeholder — FormRenderer component comes in Phase 3 */}
        {fields.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            This form has no fields yet.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {fields.map((field) => {
              if (field.type === "divider") {
                return <hr key={field.id} style={{ borderColor: "var(--border)" }} />;
              }
              if (field.type === "section_header") {
                return (
                  <h2 key={field.id} className="text-base font-semibold font-syne pt-2" style={{ color: "var(--text)" }}>
                    {field.label}
                  </h2>
                );
              }
              return (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {field.label}
                    {field.isRequired && <span className="ml-1" style={{ color: "var(--destructive)" }}>*</span>}
                  </label>
                  {field.helpText && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{field.helpText}</p>
                  )}
                  <input
                    disabled
                    placeholder={field.placeholder ?? ""}
                    className="rounded px-3 py-2 text-sm w-full outline-none"
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  />
                </div>
              );
            })}

            <button
              disabled
              className="mt-4 w-full py-2.5 rounded text-sm font-semibold text-white opacity-50 cursor-not-allowed"
              style={{ background: form.accentColor ?? "var(--accent)" }}
            >
              Submit (Phase 3)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
