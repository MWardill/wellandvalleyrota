import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listBookings,
  createBooking,
  deleteBooking,
} from "./bookings";
import * as sheets from "./sheets";

vi.mock("server-only", () => ({}));

vi.mock("./sheets", () => ({
  getSheetsClient: vi.fn(),
  getSheetId: vi.fn(() => "mock-sheet-id"),
}));

const mockValuesGet = vi.fn();
const mockValuesUpdate = vi.fn();
const mockValuesAppend = vi.fn();
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
    },
  },
};

describe("bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sheets.getSheetsClient).mockReturnValue(mockClient as unknown as ReturnType<typeof sheets.getSheetsClient>);

    mockSpreadsheetsGet.mockResolvedValue({
      data: {
        sheets: [{ properties: { title: "Bookings", sheetId: 111 } }],
      },
    });

    mockValuesGet.mockImplementation(async ({ range }) => {
      if (range.includes("!A1:G1") || range.includes("!A1")) {
        return { data: { values: [["header"]] } };
      }
      if (range === "Bookings!A:G") {
        return {
          data: {
            values: [
              ["id", "exhibitionId", "date", "shiftId", "name", "phone", "createdAt"],
              ["bk-1", "ex-1", "2026-06-21", "sh-1", "John", "123", "2026-06-21T10:00:00Z"],
              ["bk-2", "ex-2", "2026-06-22", "sh-1", "Jane", "456", "2026-06-22T10:00:00Z"],
            ],
          },
        };
      }
      if (range === "Bookings!A:A") {
        return {
          data: {
             values: [
               ["id"],
               ["bk-1"],
               ["bk-2"]
             ]
          }
        }
      }
      return { data: { values: [] } };
    });
  });

  it("lists bookings for a specific exhibition", async () => {
    const list = await listBookings("ex-1");
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("bk-1");
    expect(list[0].name).toBe("John");
  });

  it("creates a booking using A:G range", async () => {
    mockValuesAppend.mockResolvedValue({});

    const bk = await createBooking({
      exhibitionId: "ex-1",
      date: "2026-06-23",
      shiftId: "sh-2",
      name: "Alice",
      phone: "789",
    });

    expect(bk.id).toBeDefined();
    expect(mockValuesAppend).toHaveBeenCalledWith(
      expect.objectContaining({
        range: "Bookings!A:G",
        requestBody: {
          values: [[
            bk.id, "ex-1", "2026-06-23", "sh-2", "Alice", "789", bk.createdAt
          ]]
        }
      })
    );
  });

  it("deletes a booking using deleteDimension", async () => {
    mockBatchUpdate.mockResolvedValue({});

    await deleteBooking("bk-2");

    expect(mockBatchUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 111,
                  dimension: "ROWS",
                  startIndex: 2, // row 3 is index 2
                  endIndex: 3,
                }
              }
            }
          ]
        }
      })
    );
  });
});
