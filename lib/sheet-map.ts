import type { Exhibition } from "./types";

// Column order: A=id B=societyName C=title D=startDate E=endDate F=createdAt
export const EXHIBITION_HEADER = [
  "id", "societyName", "title", "startDate", "endDate", "createdAt",
] as const;

export function exhibitionToRow(ex: Exhibition): string[] {
  return [
    ex.id, ex.societyName, ex.title,
    ex.startDate, ex.endDate,
    ex.createdAt,
  ];
}

export function rowToExhibition(row: string[]): Exhibition | null {
  const [id, societyName, title, startDate, endDate, createdAt] = row;
  if (!id) return null;
  return {
    id,
    societyName: societyName ?? "",
    title:       title       ?? "",
    startDate:   startDate   ?? "",
    endDate:     endDate     ?? "",
    createdAt:   createdAt   ?? "",
    active:      false, // Will be populated by listExhibitions
  };
}
