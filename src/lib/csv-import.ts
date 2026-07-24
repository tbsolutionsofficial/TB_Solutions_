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

// Splits a plain list cell (items, techStack, tags) on any run of ";", "|", or newlines —
// lenient on purpose since these values have no further internal structure, so whichever
// separator someone reaches for in a spreadsheet just works.
export function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[;|\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Splits a paired-list cell (services, faq, extraLinks) into individual entries. Single
// "|" is reserved for the inner label/value separator (see splitPairFirst), so only ";",
// newlines, or a literal "||" separate whole entries from each other.
function splitEntries(value: string | undefined): string[] {
  return (value ?? "")
    .split(/;|\n|\|\|/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Splits "label<sep>value" on the FIRST occurrence of a separator only — so the value
// half can safely contain more separator-like characters without corrupting the split
// (this is what silently dropped a second FAQ entry before: a global split merged
// "answer||next question" into one field). Tries "::" then "|" then ":" so whichever
// convention someone used still parses.
function splitPairFirst(entry: string): [string, string] | null {
  for (const sep of ["::", "|", ":"]) {
    const idx = entry.indexOf(sep);
    if (idx > 0) {
      return [entry.slice(0, idx).trim(), entry.slice(idx + sep.length).trim()];
    }
  }
  return null;
}

// Parses entries like "Label::URL" or "Label|URL" into [{label, url}].
export function splitLabeledPairs(value: string | undefined): { label: string; url: string }[] {
  return splitEntries(value)
    .map((entry) => {
      const pair = splitPairFirst(entry);
      return pair && pair[0] && pair[1] ? { label: pair[0], url: pair[1] } : null;
    })
    .filter(Boolean) as { label: string; url: string }[];
}

// Parses entries like "Question::Answer" into [[question, answer], ...].
export function splitDoublePairs(value: string | undefined): [string, string][] {
  return splitEntries(value)
    .map((entry) => splitPairFirst(entry))
    .filter((p): p is [string, string] => !!p && !!p[0] && !!p[1]);
}
