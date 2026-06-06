import { describe, it, expect } from "vitest";
import { validateExhibitionInput } from "./validation";

describe("validateExhibitionInput", () => {
  const valid = {
    societyName: "Welland Valley Art Society",
    title: "Autumn 2026",
    startDate: "2026-09-28",
    endDate: "2026-10-18",
  };

  it("accepts a valid input", () => {
    expect(validateExhibitionInput(valid)).toEqual({ ok: true });
  });

  it("requires a society name", () => {
    const r = validateExhibitionInput({ ...valid, societyName: "  " });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.societyName).toBeTruthy();
  });

  it("allows an empty title", () => {
    expect(validateExhibitionInput({ ...valid, title: "" })).toEqual({ ok: true });
  });

  it("requires a start date", () => {
    const r = validateExhibitionInput({ ...valid, startDate: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.startDate).toBeTruthy();
  });

  it("requires an end date", () => {
    const r = validateExhibitionInput({ ...valid, endDate: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.endDate).toBeTruthy();
  });

  it("rejects end date before start date", () => {
    const r = validateExhibitionInput({ ...valid, startDate: "2026-10-18", endDate: "2026-09-28" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.endDate).toBeTruthy();
  });

  it("accepts end date equal to start date", () => {
    expect(validateExhibitionInput({ ...valid, startDate: "2026-09-28", endDate: "2026-09-28" })).toEqual({ ok: true });
  });

  it("rejects malformed dates", () => {
    const r = validateExhibitionInput({ ...valid, startDate: "28/09/2026" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.startDate).toBeTruthy();
  });
});
