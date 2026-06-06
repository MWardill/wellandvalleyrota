import { describe, it, expect } from "vitest";
import { EXHIBITION_HEADER, exhibitionToRow, rowToExhibition } from "./sheet-map";
import type { Exhibition } from "./types";

const ex: Exhibition = {
  id: "abc123",
  societyName: "Welland Valley Art Society",
  title: "Autumn 2026",
  startDate: "2026-09-28",
  endDate: "2026-10-18",
  createdAt: "2026-06-06T10:00:00.000Z",
};

describe("sheet-map", () => {
  it("has the expected header", () => {
    expect(EXHIBITION_HEADER).toEqual([
      "id", "societyName", "title", "startDate", "endDate", "createdAt",
    ]);
  });

  it("serializes an exhibition to a row in header order", () => {
    expect(exhibitionToRow(ex)).toEqual([
      "abc123", "Welland Valley Art Society", "Autumn 2026",
      "2026-09-28", "2026-10-18", "2026-06-06T10:00:00.000Z",
    ]);
  });

  it("parses a row back to an exhibition", () => {
    expect(rowToExhibition(exhibitionToRow(ex))).toEqual(ex);
  });

  it("tolerates missing trailing cells (empty title)", () => {
    const row = ["id1", "Soc", "", "2026-01-01", "2026-01-02"]; // createdAt missing
    expect(rowToExhibition(row)).toEqual({
      id: "id1", societyName: "Soc", title: "", startDate: "2026-01-01",
      endDate: "2026-01-02", createdAt: "",
    });
  });

  it("returns null for a row without an id", () => {
    expect(rowToExhibition(["", "Soc", "", "2026-01-01", "2026-01-02", ""])).toBeNull();
  });
});
