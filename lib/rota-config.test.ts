import { describe, it, expect } from "vitest";
import {
  getExhibitionDates,
  dayOffset,
  getSpecialDay,
  getShiftSpecialDay,
  isDayClosed,
  isoDate,
} from "./rota-config";

describe("rota-config", () => {
  it("calculates exhibition dates correctly", () => {
    const dates = getExhibitionDates("2026-09-28", "2026-09-30");
    expect(dates).toHaveLength(3);
    expect(isoDate(dates[0])).toBe("2026-09-28");
    expect(isoDate(dates[1])).toBe("2026-09-29");
    expect(isoDate(dates[2])).toBe("2026-09-30");
  });

  it("calculates day offsets correctly", () => {
    const start = "2026-09-28";
    expect(dayOffset(new Date(start + "T12:00:00"), start)).toBe(0);
    expect(dayOffset(new Date("2026-09-29T12:00:00"), start)).toBe(1);
  });

  it("identifies special days", () => {
    const start = "2026-09-28";

    // Offset 0 is hanging day — partially open (s1 + s2 no-book, s3 open)
    const day0 = new Date("2026-09-28T12:00:00");
    expect(getSpecialDay(day0, start)).toBeNull();  // no closed entry
    expect(isDayClosed(day0, start)).toBe(false);
    expect(getShiftSpecialDay(day0, start, "s1")?.noBook).toBe(true);
    expect(getShiftSpecialDay(day0, start, "s2")?.noBook).toBe(true);
    expect(getShiftSpecialDay(day0, start, "s3")).toBeNull();  // s3 is open

    // Offset 2 is a normal open day
    const day2 = new Date("2026-09-30T12:00:00");
    expect(getSpecialDay(day2, start)).toBeNull();
    expect(isDayClosed(day2, start)).toBe(false);
  });
});
