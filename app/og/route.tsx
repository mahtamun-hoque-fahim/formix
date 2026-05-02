import { ImageResponse } from "@vercel/og";
import { getDb } from "@/lib/db";
import { forms, formSubmissions } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "";

  let title = "Formify Form";
  let description = "";
  let responseCount = 0;
  let accentColor = "#6366f1";

  try {
    const db = getDb();
    const [form] = await db
      .select({
        title: forms.title,
        description: forms.description,
        accentColor: forms.accentColor,
        id: forms.id,
      })
      .from(forms)
      .where(eq(forms.slug, slug));

    if (form) {
      title = form.title;
      description = form.description ?? "";
      accentColor = form.accentColor ?? "#6366f1";

      const [{ total }] = await db
        .select({ total: count() })
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, form.id));
      responseCount = Number(total);
    }
  } catch {
    // Silently fall back to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
          padding: "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "9999px",
            background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          }}
        />

        {/* Top accent bar */}
        <div style={{ width: "100%", height: "4px", background: accentColor }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 72px", justifyContent: "center" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}40`,
              borderRadius: "9999px",
              padding: "6px 16px",
              marginBottom: "28px",
              width: "fit-content",
            }}
          >
            <span style={{ color: accentColor, fontSize: "13px", fontWeight: 600 }}>
              Formify · Fill out this form
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? "44px" : "56px",
              fontWeight: 700,
              color: "#f5f5f5",
              lineHeight: 1.1,
              marginBottom: "20px",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: "22px",
                color: "#888888",
                lineHeight: 1.4,
                maxWidth: "800px",
                overflow: "hidden",
                display: "-webkit-box",
              }}
            >
              {description.length > 120 ? description.slice(0, 120) + "…" : description}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 72px",
            borderTop: "1px solid #1f1f1f",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "#f5f5f5" }}>
              Form<span style={{ color: accentColor }}>ix</span>
            </span>
          </div>

          {/* Response count */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                background: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: "8px",
                padding: "8px 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#888888", fontSize: "15px" }}>
                {responseCount > 0 ? `${responseCount} responses` : "Be the first to respond"}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
