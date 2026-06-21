import { describe, it, expect } from "vitest";
import { SHIFTS, MAX_PER_SLOT } from "./shifts";

describe("shifts", () => {
  it("exports valid shift configuration", () => {
    expect(SHIFTS.length).toBeGreaterThan(0);
    expect(SHIFTS[0]).toHaveProperty("id");
    expect(SHIFTS[0]).toHaveProperty("label");
  });

  it("exports MAX_PER_SLOT", () => {
    expect(MAX_PER_SLOT).toBeGreaterThan(0);
  });
});
