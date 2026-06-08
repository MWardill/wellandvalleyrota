import type { Exhibition } from "./types";

// Column order: A=id B=societyName C=title D=startDate E=endDate F=createdAt G=active
// `active` is appended as column G so existing rows (which have no column G) remain valid.
export const EXHIBITION_HEADER = [
  "id", "societyName", "title", "startDate", "endDate", "createdAt", "active",
] as const;

export function exhibitionToRow(ex: Exhibition): string[] {
  return [
    ex.id, ex.societyName, ex.title,
    ex.startDate, ex.endDate,
    ex.createdAt,
    String(ex.active),
  ];
}

export function rowToExhibition(row: string[]): Exhibition | null {
  const [id, societyName, title, startDate, endDate, createdAt, active] = row;
  if (!id) return null;
  return {
    id,
    societyName: societyName ?? "",
    title:       title       ?? "",
    startDate:   startDate   ?? "",
    endDate:     endDate     ?? "",
    createdAt:   createdAt   ?? "",
    active:      active === "true",   // missing/empty → false (backwards-compatible)
  };
}
