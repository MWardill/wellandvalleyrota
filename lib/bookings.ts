import "server-only";
import { randomUUID } from "crypto";
import { getSheetsClient, getSheetId } from "./sheets";
import type { Booking, BookingInput } from "./types";

const TAB    = "Bookings";
const RANGE  = `${TAB}!A:G`;
const HEADER = ["id", "exhibitionId", "date", "shiftId", "name", "phone", "createdAt"] as const;

async function ensureSheet(): Promise<void> {
  const sheets        = getSheetsClient();
  const spreadsheetId = getSheetId();

  const meta   = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets?.some(s => s.properties?.title === TAB);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: TAB } } }] },
    });
  }

  const header = await sheets.spreadsheets.values.get({
    spreadsheetId, range: `${TAB}!A1:G1`,
  });
  if (!header.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: `${TAB}!A1`, valueInputOption: "RAW",
      requestBody: { values: [[...HEADER]] },
    });
  }
}

function rowToBooking(row: string[]): Booking | null {
  const [id, exhibitionId, date, shiftId, name, phone, createdAt] = row;
  if (!id) return null;
  return {
    id,
    exhibitionId: exhibitionId ?? "",
    date:         date         ?? "",
    shiftId:      shiftId      ?? "",
    name:         name         ?? "",
    phone:        phone        ?? "",
    createdAt:    createdAt    ?? "",
  };
}

export async function listBookings(exhibitionId: string): Promise<Booking[]> {
  await ensureSheet();
  const sheets = getSheetsClient();
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(), range: RANGE,
  });
  const rows = res.data.values ?? [];
  return rows
    .slice(1)
    .map(r => rowToBooking(r as string[]))
    .filter((b): b is Booking => b !== null && b.exhibitionId === exhibitionId);
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  await ensureSheet();
  const booking: Booking = {
    id:           randomUUID(),
    exhibitionId: input.exhibitionId,
    date:         input.date,
    shiftId:      input.shiftId,
    name:         input.name.trim(),
    phone:        input.phone.trim(),
    createdAt:    new Date().toISOString(),
  };
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId:   getSheetId(),
    range:           RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        booking.id, booking.exhibitionId, booking.date,
        booking.shiftId, booking.name, booking.phone, booking.createdAt,
      ]],
    },
  });
  return booking;
}

export async function deleteBooking(id: string): Promise<void> {
  const sheets        = getSheetsClient();
  const spreadsheetId = getSheetId();

  // Find the 1-based row number for this id.
  const col  = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${TAB}!A:A` });
  const ids  = col.data.values ?? [];
  let rowNumber: number | null = null;
  for (let i = 1; i < ids.length; i++) {
    if (ids[i]?.[0] === id) { rowNumber = i + 1; break; }
  }
  if (rowNumber === null) throw new Error(`Booking not found: ${id}`);

  // Resolve numeric sheetId for the deleteDimension request.
  const meta  = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets?.find(s => s.properties?.title === TAB);
  const numericSheetId = sheet?.properties?.sheetId;
  if (numericSheetId === undefined || numericSheetId === null) {
    throw new Error("Bookings tab not found");
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId:    numericSheetId,
            dimension:  "ROWS",
            startIndex: rowNumber - 1, // 0-based, inclusive
            endIndex:   rowNumber,     // exclusive
          },
        },
      }],
    },
  });
}
