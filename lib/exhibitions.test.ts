import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listExhibitions,
  createExhibition,
  updateExhibition,
  setActiveExhibition,
  deleteExhibition,
  getActiveExhibition,
} from "./exhibitions";
import * as sheets from "./sheets";

vi.mock("server-only", () => ({}));

vi.mock("./sheets", () => ({
  getSheetsClient: vi.fn(),
  getSheetId: vi.fn(() => "mock-sheet-id"),
}));

const mockValuesGet = vi.fn();
const mockValuesUpdate = vi.fn();
const mockValuesAppend = vi.fn();
const mockValuesBatchUpdate = vi.fn();
const mockSpreadsheetsGet = vi.fn();
const mockBatchUpdate = vi.fn();

const mockClient = {
  spreadsheets: {
    get: mockSpreadsheetsGet,
    batchUpdate: mockBatchUpdate,
    values: {
      get: mockValuesGet,
      update: mockValuesUpdate,
      append: mockValuesAppend,
      batchUpdate: mockValuesBatchUpdate,
    },
  },
};

describe("exhibitions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sheets.getSheetsClient).mockReturnValue(mockClient as any);
    
    // Mock ensureSheet meta calls
    mockSpreadsheetsGet.mockResolvedValue({
      data: {
        sheets: [
          { properties: { title: "Exhibitions", sheetId: 123 } },
          { properties: { title: "Settings", sheetId: 456 } },
        ],
      },
    });

    // Mock ensureSheet header calls to return existing headers
    mockValuesGet.mockImplementation(async ({ range }) => {
      if (range.includes("!A1:F1") || range.includes("!A1")) {
        return { data: { values: [["header"]] } };
      }
      if (range === "Exhibitions!A:F") {
        return {
          data: {
            values: [
              ["id", "societyName", "title", "startDate", "endDate", "createdAt"],
              ["ex-1", "Test Society", "Title 1", "2026-01-01", "2026-01-10", "2026-01-01T00:00:00Z"],
              ["ex-2", "Test Society 2", "Title 2", "2026-02-01", "2026-02-10", "2026-02-01T00:00:00Z"],
            ],
          },
        };
      }
      if (range === "Settings!B1") {
        return { data: { values: [["ex-1"]] } };
      }
      if (range === "Exhibitions!A:A") {
         return {
           data: {
             values: [
               ["id"],
               ["ex-1"],
               ["ex-2"]
             ]
           }
         }
      }
      return { data: { values: [] } };
    });
  });

  it("lists exhibitions and populates active flag from Settings", async () => {
    const list = await listExhibitions();
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe("ex-1");
    expect(list[0].active).toBe(true);
    expect(list[1].id).toBe("ex-2");
    expect(list[1].active).toBe(false);
  });

  it("creates an exhibition using A:F range", async () => {
    mockValuesAppend.mockResolvedValue({});
    
    const ex = await createExhibition({
      societyName: "New Soc",
      title: "New Title",
      startDate: "2026-03-01",
      endDate: "2026-03-10",
    });

    expect(ex.id).toBeDefined();
    expect(mockValuesAppend).toHaveBeenCalledWith(
      expect.objectContaining({
        range: "Exhibitions!A:F",
        requestBody: {
          values: [[
            ex.id, "New Soc", "New Title", "2026-03-01", "2026-03-10", ex.createdAt
          ]]
        }
      })
    );
  });

  it("updates an exhibition using A:F range and specific row", async () => {
    mockValuesUpdate.mockResolvedValue({});
    
    await updateExhibition("ex-2", {
      societyName: "Updated Soc",
      title: "Updated Title",
      startDate: "2026-05-01",
      endDate: "2026-05-10",
    });

    // "ex-2" is on row 3
    expect(mockValuesUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        range: "Exhibitions!A3:F3",
        requestBody: {
          values: [[
            "ex-2", "Updated Soc", "Updated Title", "2026-05-01", "2026-05-10", "2026-02-01T00:00:00Z"
          ]]
        }
      })
    );
  });

  it("sets active exhibition using Settings!B1 range", async () => {
    mockValuesUpdate.mockResolvedValue({});
    
    await setActiveExhibition("ex-2");

    expect(mockValuesUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        range: "Settings!B1",
        requestBody: {
          values: [["ex-2"]]
        }
      })
    );
  });

  it("deletes an exhibition using deleteDimension", async () => {
    mockBatchUpdate.mockResolvedValue({});
    
    await deleteExhibition("ex-1");

    expect(mockBatchUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 123,
                  dimension: "ROWS",
                  startIndex: 1, // row 2 is index 1
                  endIndex: 2,
                }
              }
            }
          ]
        }
      })
    );
  });

  it("getActiveExhibition correctly finds active", async () => {
    const list = await listExhibitions();
    const active = getActiveExhibition(list);
    expect(active?.id).toBe("ex-1");
  });
});
