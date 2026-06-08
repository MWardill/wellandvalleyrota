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
export const SPECIAL_DAYS: Record<number, SpecialDay> = {
  0:  { type: "closed",    label: "Exhibition Hanging Day" },
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
  return SPECIAL_DAYS[dayOffset(d, startDate)] ?? null;
}

export function isDayClosed(d: Date, startDate: string): boolean {
  return getSpecialDay(d, startDate)?.type === "closed";
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
