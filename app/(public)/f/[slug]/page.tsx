import { getDb } from "@/lib/db";
import { forms, formFields } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { FormRenderer } from "@/components/form-renderer/FormRenderer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const [form] = await db
    .select({ title: forms.title, description: forms.description })
    .from(forms)
    .where(eq(forms.slug, slug));
  return {
    title: form?.title ?? "Form",
    description: form?.description ?? undefined,
  };
}

export default async function PublicFormPage({ params }: Props) {
  const { slug } = await params;
  const db = getDb();

  const [form] = await db.select().from(forms).where(eq(forms.slug, slug));
  if (!form) notFound();

  if (form.status === "draft") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--bg)" }}
      >
        <div className="text-center">
          <p className="text-2xl mb-2">🔒</p>
          <h1 className="text-lg font-semibold font-syne mb-1" style={{ color: "var(--text)" }}>
            Form not published
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            This form is not yet accepting responses.
          </p>
        </div>
      </main>
    );
  }

  if (form.status === "closed") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--bg)" }}
      >
        <div className="text-center">
          <p className="text-2xl mb-2">🔒</p>
          <h1 className="text-lg font-semibold font-syne mb-1" style={{ color: "var(--text)" }}>
            Form closed
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            This form is no longer accepting responses.
          </p>
        </div>
      </main>
    );
  }

  const fields = await db
    .select()
    .from(formFields)
    .where(eq(formFields.formId, form.id))
    .orderBy(formFields.order);

  const accent = form.accentColor ?? "#6366f1";

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-xl mx-auto">
        {/* Form card */}
        <div
          className="rounded-xl p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Accent bar at top */}
          <div
            className="h-1 rounded-t-xl -mt-8 -mx-8 mb-8"
            style={{ background: accent }}
          />

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold font-syne mb-2"
              style={{ color: "var(--text)" }}
            >
              {form.title}
            </h1>
            {form.description && (
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {form.description}
              </p>
            )}
          </div>

          {fields.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              This form has no fields yet.
            </p>
          ) : (
            <FormRenderer form={form} fields={fields} />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--text-disabled)" }}>
          Powered by{" "}
          <a
            href="/"
            className="hover:underline"
            style={{ color: "var(--text-muted)" }}
          >
            Formix
          </a>
        </p>
      </div>
    </main>
  );
}
