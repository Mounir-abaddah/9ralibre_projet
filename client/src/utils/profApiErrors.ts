export type ProfApiIssue = {
  path?: (string | number)[];
  message: string;
};

export type ProfApiErrorBody = {
  success?: boolean;
  message?: string | string[];
  issues?: ProfApiIssue[];
};

export function messagesFromApiData(data: unknown): string[] {
  if (!data || typeof data !== "object") return [];
  const d = data as ProfApiErrorBody;
  const msg = d.message;
  if (Array.isArray(msg)) {
    return msg.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof msg === "string") {
    const t = msg.trim();
    if (!t) return [];
    return t.split(/,\s+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function fieldErrorsFromIssues(
  issues: ProfApiIssue[] | undefined
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!issues?.length) return out;
  for (const issue of issues) {
    const seg = issue.path?.[0];
    if (seg === undefined || seg === null) continue;
    const key = String(seg);
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
