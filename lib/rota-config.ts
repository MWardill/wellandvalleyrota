/**
 * Rota configuration: date helpers, special-day rules, and formatting utilities.
 *
 * Intentionally NOT server-only so client components (the interactive shift
 * picker) can import the pure date helpers alongside server components.
 *
 * SPECIAL_DAYS is currently hard-coded for the Autumn 2026 exhibition (offsets
 * from its start date). Per-exhibition special-day configuration is a planned
 * future enhancement.
 */

export type SpecialDayClosed = { type: "closed"; label: string };
export type SpecialDaySlotNote = {
  type: "slot-note";
  shiftId: string;
  note: string;
  noBook?: boolean;
};
export type SpecialDay = SpecialDayClosed | SpecialDaySlotNote;

/**
 * Day-offset → special rule. Offset 0 = startDate of the exhibition.
 * Currently meaningful only when the exhibition starts on 2026-09-28.
 */
export const SPECIAL_DAYS: Record<number, SpecialDay | SpecialDay[]> = {
  0: [
    { type: "slot-note", shiftId: "s1", note: "Hanging Day", noBook: true },
    { type: "slot-note", shiftId: "s2", note: "Hanging Day", noBook: true },
  ],
  1:  { type: "slot-note", shiftId: "s3", note: "Private View – no booking", noBook: true },
  6:  { type: "closed",    label: "Closed" },
  13: { type: "closed",    label: "Closed" },
  19: { type: "slot-note", shiftId: "s3", note: "Customer Collection from 4:00pm" },
  20: { type: "closed",    label: "Closed" },
};

/** All dates (inclusive) from startDate to endDate. */
export function getExhibitionDates(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  const cur = new Date(startDate + "T12:00:00");
  const end = new Date(endDate   + "T12:00:00");
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function dayOffset(d: Date, startDate: string): number {
  const start = new Date(startDate + "T12:00:00");
  return Math.round((d.getTime() - start.getTime()) / 86_400_000);
}

export function getSpecialDay(d: Date, startDate: string): SpecialDay | null {
  const entry = SPECIAL_DAYS[dayOffset(d, startDate)];
  if (!entry) return null;
  if (Array.isArray(entry)) return (entry.find(e => e.type === "closed") as SpecialDayClosed) ?? null;
  return entry;
}

export function isDayClosed(d: Date, startDate: string): boolean {
  const entry = SPECIAL_DAYS[dayOffset(d, startDate)];
  if (!entry) return false;
  const entries = Array.isArray(entry) ? entry : [entry];
  return entries.some(e => e.type === "closed");
}

export function getShiftSpecialDay(d: Date, startDate: string, shiftId: string): SpecialDaySlotNote | null {
  const entry = SPECIAL_DAYS[dayOffset(d, startDate)];
  if (!entry) return null;
  const entries = Array.isArray(entry) ? entry : [entry];
  const match = entries.find(e => e.type === "slot-note" && e.shiftId === shiftId);
  return (match as SpecialDaySlotNote) ?? null;
}

export function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function fmtLong(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });
}

export function fmtShort(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function fmtWday(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}
