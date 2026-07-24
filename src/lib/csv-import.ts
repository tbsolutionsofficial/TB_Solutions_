import Papa from "papaparse";

export function parseCsvFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (err: Error) => reject(err),
    });
  });
}

export function downloadCsvTemplate(columns: string[], exampleRow: Record<string, string>, filename: string) {
  const csv = Papa.unparse({ fields: columns, data: [columns.map((c) => exampleRow[c] ?? "")] });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Splits on ";" trimming whitespace, dropping empty entries — used for CSV cells that
// hold a list (techStack, tags, checklist items, etc.).
export function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Parses "Label1|URL1;Label2|URL2" into [{label, url}].
export function splitLabeledPairs(value: string | undefined, sep = "|"): { label: string; url: string }[] {
  return splitList(value)
    .map((entry) => {
      const [label, url] = entry.split(sep).map((s) => s.trim());
      return label && url ? { label, url } : null;
    })
    .filter(Boolean) as { label: string; url: string }[];
}

// Parses "Q1::A1;Q2::A2" into [{q, a}] / [{title, description}] shaped pairs.
export function splitDoublePairs(value: string | undefined, sep = "::"): [string, string][] {
  return splitList(value)
    .map((entry) => {
      const [a, b] = entry.split(sep).map((s) => s.trim());
      return a && b ? ([a, b] as [string, string]) : null;
    })
    .filter(Boolean) as [string, string][];
}
