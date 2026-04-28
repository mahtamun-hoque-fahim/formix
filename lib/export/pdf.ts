// jspdf-autotable augments jsPDF prototype — must import for side effects
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportRow {
  index: number;
  submittedAt: string;
  respondentEmail: string;
  [fieldLabel: string]: string | number;
}

const ACCENT = [99, 102, 241] as [number, number, number]; // #6366f1
const BG_HEADER = [17, 17, 17] as [number, number, number]; // #111111
const TEXT_LIGHT = [245, 245, 245] as [number, number, number]; // #f5f5f5
const TEXT_MUTED = [136, 136, 136] as [number, number, number]; // #888888
const BG_ALT = [26, 26, 26] as [number, number, number]; // #1a1a1a
const BG_BODY = [10, 10, 10] as [number, number, number]; // #0a0a0a

export function buildPdf(
  rows: ExportRow[],
  formTitle: string,
  formSlug: string
): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();

  // ── Cover header bar ────────────────────────────────────────────────────
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageW, 6, "F");

  // Background
  doc.setFillColor(...BG_BODY);
  doc.rect(0, 6, pageW, doc.internal.pageSize.getHeight() - 6, "F");

  // Title
  doc.setTextColor(...TEXT_LIGHT);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(formTitle, 40, 48);

  // Meta line
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_MUTED);
  doc.text(
    `${rows.length} response${rows.length !== 1 ? "s" : ""}   ·   Exported ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}   ·   /f/${formSlug}`,
    40,
    64
  );

  // Divider
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.5);
  doc.line(40, 72, pageW - 40, 72);

  if (rows.length === 0) {
    doc.setTextColor(...TEXT_MUTED);
    doc.setFontSize(11);
    doc.text("No responses to export.", 40, 110);
    return Buffer.from(doc.output("arraybuffer"));
  }

  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => String(r[h] ?? "")));

  autoTable(doc, {
    startY: 86,
    head: [headers],
    body,
    theme: "plain",
    styles: {
      fontSize: 8,
      cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
      textColor: TEXT_LIGHT,
      fillColor: BG_BODY,
      lineColor: [31, 31, 31],
      lineWidth: 0.3,
      font: "helvetica",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: BG_HEADER,
      textColor: TEXT_MUTED,
      fontStyle: "bold",
      fontSize: 7.5,
      lineColor: ACCENT,
      lineWidth: { bottom: 0.75, top: 0, left: 0, right: 0 },
    },
    alternateRowStyles: {
      fillColor: BG_ALT,
    },
    columnStyles: {
      0: { cellWidth: 24, halign: "center" },   // #
      1: { cellWidth: 90 },                      // submitted at
      2: { cellWidth: 110 },                     // email
    },
    margin: { left: 40, right: 40 },
    tableLineColor: [31, 31, 31],
    tableLineWidth: 0.3,
    // Page numbers in footer
    didDrawPage: (data) => {
      const pageCount = (doc as jsPDF & { internal: { getNumberOfPages: () => number } })
        .internal.getNumberOfPages();
      const pageNum = data.pageNumber;
      doc.setFontSize(7);
      doc.setTextColor(...TEXT_MUTED);
      doc.text(
        `Page ${pageNum} of ${pageCount}   ·   Formix`,
        pageW / 2,
        doc.internal.pageSize.getHeight() - 18,
        { align: "center" }
      );
      // Accent bar on every page
      doc.setFillColor(...ACCENT);
      doc.rect(0, 0, pageW, 3, "F");
    },
  });

  return Buffer.from(doc.output("arraybuffer"));
}
