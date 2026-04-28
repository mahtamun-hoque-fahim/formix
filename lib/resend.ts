import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

interface SubmissionNotificationParams {
  toEmail: string;
  toName: string | null;
  formTitle: string;
  formSlug: string;
  respondentEmail: string | null;
  submissionId: string;
  submittedAt: Date;
  fieldSummary: { label: string; value: string }[];
}

export async function sendSubmissionNotification(params: SubmissionNotificationParams) {
  const {
    toEmail,
    toName,
    formTitle,
    formSlug,
    respondentEmail,
    submissionId,
    submittedAt,
    fieldSummary,
  } = params;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://formix.vercel.app";
  const responsesUrl = `${appUrl}/dashboard/forms/${formSlug}/responses`;

  const fieldRows = fieldSummary
    .slice(0, 8) // cap preview at 8 fields
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:8px 12px;color:#888888;font-size:13px;border-bottom:1px solid #1f1f1f;width:35%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;color:#f5f5f5;font-size:13px;border-bottom:1px solid #1f1f1f;word-break:break-word;">${escapeHtml(value || "—")}</td>
        </tr>`
    )
    .join("");

  const moreFields =
    fieldSummary.length > 8
      ? `<p style="margin:12px 0 0;font-size:12px;color:#888888;text-align:center;">+ ${fieldSummary.length - 8} more fields</p>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New submission — ${escapeHtml(formTitle)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header accent bar -->
          <tr>
            <td style="height:4px;background:#6366f1;border-radius:8px 8px 0 0;"></td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111111;border-radius:0 0 12px 12px;padding:32px;">

              <!-- Logo + label -->
              <p style="margin:0 0 24px;font-size:13px;font-weight:600;letter-spacing:0.08em;color:#6366f1;text-transform:uppercase;">Formix</p>

              <!-- Heading -->
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f5f5f5;line-height:1.3;">
                New response on <span style="color:#6366f1;">${escapeHtml(formTitle)}</span>
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#888888;">
                ${respondentEmail ? `From <strong style="color:#f5f5f5;">${escapeHtml(respondentEmail)}</strong> · ` : ""}
                ${formatDate(submittedAt)}
              </p>

              <!-- Field preview table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1f1f1f;border-radius:8px;overflow:hidden;border-collapse:collapse;">
                <thead>
                  <tr style="background:#1a1a1a;">
                    <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;letter-spacing:0.06em;color:#888888;text-transform:uppercase;" colspan="2">Response Preview</th>
                  </tr>
                </thead>
                <tbody>
                  ${fieldRows || `<tr><td colspan="2" style="padding:16px 12px;color:#888888;font-size:13px;text-align:center;">No field data</td></tr>`}
                </tbody>
              </table>
              ${moreFields}

              <!-- CTA button -->
              <div style="margin-top:28px;text-align:center;">
                <a href="${responsesUrl}" style="display:inline-block;padding:12px 28px;background:#6366f1;color:#ffffff;font-size:14px;font-weight:600;border-radius:6px;text-decoration:none;letter-spacing:0.01em;">
                  View Full Response →
                </a>
              </div>

              <!-- Footer -->
              <hr style="margin:28px 0;border:none;border-top:1px solid #1f1f1f;" />
              <p style="margin:0;font-size:12px;color:#3d3d3d;text-align:center;line-height:1.6;">
                You're receiving this because <strong style="color:#888888;">${escapeHtml(toEmail)}</strong> has notifications enabled.<br/>
                Submission ID: <span style="font-family:monospace;">${escapeHtml(submissionId.slice(0, 8))}</span> ·
                <a href="${appUrl}/dashboard" style="color:#6366f1;text-decoration:none;">Dashboard</a>
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "notify@formix.app",
    to: toEmail,
    subject: `New response on "${formTitle}"`,
    html,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
