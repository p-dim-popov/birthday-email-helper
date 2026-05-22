/** Parse a pasted email blob into a deduped list. */

/** Split on whitespace, newlines, commas, semicolons; trim; dedupe case-insensitively. */
export function parseEmails(raw: string): string[] {
  const tokens = raw.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tokens) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}
