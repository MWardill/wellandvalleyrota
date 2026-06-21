import { describe, it, expect } from "vitest";
import { formatPhone } from "./format";

describe("formatPhone", () => {
  it("formats an 11 digit number", () => {
    expect(formatPhone("01234567890")).toBe("01234 567890");
    expect(formatPhone("01234 567 890")).toBe("01234 567890");
    expect(formatPhone("+44 (0) 1234 567890")).toBe("+44 (0) 1234 567890"); // 12 digits, returned unchanged
  });

  it("leaves non-11 digit numbers unchanged", () => {
    expect(formatPhone("123")).toBe("123");
    expect(formatPhone("none")).toBe("none");
    expect(formatPhone("N/A")).toBe("N/A");
  });
});
