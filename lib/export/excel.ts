import * as XLSX from "xlsx";

export interface ExportRow {
  index: number;
  submittedAt: string;
  respondentEmail: string;
  [fieldLabel: string]: string | number;
}

export function buildXlsx(rows: ExportRow[], formTitle: string): Buffer {
  const wb = XLSX.utils.book_new();

  // Convert rows to array-of-arrays with headers
  if (rows.length === 0) {
    const ws = XLSX.utils.aoa_to_sheet([["No responses yet"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  }

  const headers = Object.keys(rows[0]);
  const data = [
    headers,
    ...rows.map((r) => headers.map((h) => r[h] ?? "")),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Column widths
  const colWidths = headers.map((h) => ({
    wch: Math.min(
      50,
      Math.max(
        h.length + 2,
        ...rows.map((r) => String(r[h] ?? "").length + 2)
      )
    ),
  }));
  ws["!cols"] = colWidths;

  // Style header row bold (via cell metadata)
  headers.forEach((_, i) => {
    const cellAddr = XLSX.utils.encode_cell({ r: 0, c: i });
    if (ws[cellAddr]) {
      ws[cellAddr].s = { font: { bold: true } };
    }
  });

  // Freeze header row
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(wb, ws, "Responses");

  // Summary sheet — basic stats
  const summaryData: (string | number)[][] = [
    ["Form", formTitle],
    ["Exported At", new Date().toISOString()],
    ["Total Responses", rows.length],
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWs["!cols"] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
