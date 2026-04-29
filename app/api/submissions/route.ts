import { getDb } from "@/lib/db";
import { forms, formFields, formSubmissions, fieldResponses, users } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { headers } from "next/headers";
import { sendSubmissionNotification } from "@/lib/resend";
import { getRatelimiter } from "@/lib/ratelimit";

interface SubmitPayload {
  formId: string;
  responses: { fieldId: string; value: string }[];
}

export async function POST(req: Request) {
  try {
    // Rate limiting — 10 submissions per IP per minute
    const hdrsEarly = await headers();
    const ip = hdrsEarly.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const limiter = getRatelimiter();
    if (limiter) {
      const { success } = await limiter.limit(ip);
      if (!success) {
        return Response.json(
          { error: "Too many submissions. Please wait a moment and try again." },
          { status: 429 }
        );
      }
    }

    const body: SubmitPayload = await req.json();
    const { formId, responses } = body;

    if (!formId || !Array.isArray(responses)) {
      return Response.json({ error: "Invalid payload." }, { status: 400 });
    }

    const db = getDb();

    // Load form
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    if (!form) return Response.json({ error: "Form not found." }, { status: 404 });
    if (form.status !== "published") {
      return Response.json({ error: "This form is not accepting responses." }, { status: 403 });
    }

    // Check endsAt
    if (form.endsAt && new Date() > form.endsAt) {
      return Response.json({ error: "This form has closed." }, { status: 403 });
    }

    // Check submission limit
    if (form.submissionLimit) {
      const [{ total }] = await db
        .select({ total: count() })
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, formId));
      if (Number(total) >= form.submissionLimit) {
        return Response.json({ error: "This form has reached its submission limit." }, { status: 403 });
      }
    }

    // Load fields and validate required ones
    const fields = await db.select().from(formFields).where(eq(formFields.formId, formId));
    const responseMap = new Map(responses.map((r) => [r.fieldId, r.value]));

    for (const field of fields) {
      if (field.isRequired && field.type !== "section_header" && field.type !== "divider") {
        const val = responseMap.get(field.id);
        if (!val || val.trim() === "" || val === "[]" || val === "__uploading__" || val.startsWith("__error__")) {
          return Response.json(
            { error: `"${field.label}" is required.`, fieldId: field.id },
            { status: 422 }
          );
        }
      }
    }

    // Grab respondent info (ip already extracted above for rate limiting)
    const ua = hdrsEarly.get("user-agent") ?? null;

    // Find respondent email — look for an email field response
    const emailFieldId = fields.find((f) => f.type === "email")?.id;
    const respondentEmail = emailFieldId ? (responseMap.get(emailFieldId) ?? null) : null;

    // Create submission + field_responses in sequence (Neon doesn't support nested tx)
    const [submission] = await db
      .insert(formSubmissions)
      .values({
        formId,
        respondentEmail,
        ipAddress: ip,
        userAgent: ua,
      })
      .returning();

    // Insert field responses (skip display-only fields and empty optionals)
    const toInsert = responses.filter((r) => {
      const field = fields.find((f) => f.id === r.fieldId);
      if (!field) return false;
      if (field.type === "section_header" || field.type === "divider") return false;
      return true;
    });

    if (toInsert.length > 0) {
      await db.insert(fieldResponses).values(
        toInsert.map((r) => ({
          submissionId: submission.id,
          fieldId: r.fieldId,
          value: r.value,
        }))
      );
    }

    // Send email notification (fire-and-forget — never block the response)
    if (form.notifyOnSubmission) {
      const [owner] = await db.select().from(users).where(eq(users.id, form.userId));
      if (owner?.email) {
        const fieldSummary = toInsert
          .map((r) => {
            const field = fields.find((f) => f.id === r.fieldId);
            if (!field) return null;
            let displayValue = r.value;
            try {
              const parsed = JSON.parse(r.value);
              if (Array.isArray(parsed)) displayValue = parsed.join(", ");
            } catch {}
            return { label: field.label, value: displayValue };
          })
          .filter(Boolean) as { label: string; value: string }[];

        sendSubmissionNotification({
          toEmail: owner.email,
          toName: owner.name ?? null,
          formTitle: form.title,
          formSlug: form.slug,
          respondentEmail,
          submissionId: submission.id,
          submittedAt: new Date(),
          fieldSummary,
        }).catch((err) => console.error("[submissions] email error:", err));
      }
    }

    return Response.json({
      id: submission.id,
      successMessage: form.successMessage ?? "Thank you for your response!",
      redirectUrl: form.redirectUrl ?? null,
    });
  } catch (err) {
    console.error("[submissions] POST error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
