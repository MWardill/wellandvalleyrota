import "server-only";
import { cache } from "react";
import { randomUUID } from "crypto";
import { getSheetsClient, getSheetId } from "./sheets";
import { EXHIBITION_HEADER, exhibitionToRow, rowToExhibition } from "./sheet-map";
import { validateExhibitionInput } from "./validation";
import type { Exhibition, ExhibitionInput } from "./types";

const TAB = "Exhibitions";
const RANGE = `${TAB}!A:F`;
const SETTINGS_TAB = "Settings";

/** Ensure the tab exists with a header row. Safe to call repeatedly. */
const ensureSheet = cache(async (): Promise<void> => {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingTitles = meta.data.sheets?.map(s => s.properties?.title) || [];

  const requests: any[] = [];
  if (!existingTitles.includes(TAB)) {
    requests.push({ addSheet: { properties: { title: TAB } } });
  }
  if (!existingTitles.includes(SETTINGS_TAB)) {
    requests.push({ addSheet: { properties: { title: SETTINGS_TAB } } });
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  }

  const header = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${TAB}!A1:F1` });
  if (!header.data.values || header.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...EXHIBITION_HEADER]] },
    });
  }

  const settingsHeader = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${SETTINGS_TAB}!A1` });
  if (!settingsHeader.data.values || settingsHeader.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SETTINGS_TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [["ActiveExhibitionId", ""]] },
    });
  }
});

export const listExhibitions = cache(async (): Promise<Exhibition[]> => {
  await ensureSheet();
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const [exhibitionsRes, settingsRes] = await Promise.all([
    sheets.spreadsheets.values.get({ spreadsheetId, range: RANGE }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: `${SETTINGS_TAB}!B1` })
  ]);

  const activeId = settingsRes.data.values?.[0]?.[0] ?? null;
  const rows = exhibitionsRes.data.values ?? [];

  return rows
    .slice(1) // skip header
    .map((r) => {
      const ex = rowToExhibition(r as string[]);
      if (ex) {
        ex.active = ex.id === activeId;
      }
      return ex;
    })
    .filter((e): e is Exhibition => e !== null);
});

export async function createExhibition(input: ExhibitionInput): Promise<Exhibition> {
  const result = validateExhibitionInput(input);
  if (!result.ok) throw new Error("Invalid exhibition: " + JSON.stringify(result.errors));
  await ensureSheet();

  const exhibition: Exhibition = {
    id: randomUUID(),
    societyName: input.societyName.trim(),
    title: input.title.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    active: false,
    createdAt: new Date().toISOString(),
  };

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [exhibitionToRow(exhibition)] },
  });
  return exhibition;
}

/** Find the 1-based sheet row number for an exhibition id (header is row 1). */
async function findRowNumber(id: string): Promise<number | null> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `${TAB}!A:A`,
  });
  const ids = res.data.values ?? [];
  for (let i = 1; i < ids.length; i++) {
    if (ids[i]?.[0] === id) return i + 1; // +1 → 1-based row number
  }
  return null;
}

export async function updateExhibition(id: string, input: ExhibitionInput): Promise<Exhibition> {
  const result = validateExhibitionInput(input);
  if (!result.ok) throw new Error("Invalid exhibition: " + JSON.stringify(result.errors));

  const all = await listExhibitions();
  const existing = all.find((e) => e.id === id);
  if (!existing) throw new Error("Exhibition not found: " + id);

  const rowNumber = await findRowNumber(id);
  if (rowNumber === null) throw new Error("Exhibition row not found: " + id);

  const updated: Exhibition = {
    ...existing,
    societyName: input.societyName.trim(),
    title: input.title.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    // preserve active flag — toggled separately via setActiveExhibition
  };

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSheetId(),
    range: `${TAB}!A${rowNumber}:F${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [exhibitionToRow(updated)] },
  });
  return updated;
}

/**
 * Pick the active exhibition.
 * Prefers the one explicitly marked active; falls back to date-based selection
 * (soonest upcoming, or most recently ended) for backwards compatibility.
 */
export function getActiveExhibition(exhibitions: Exhibition[]): Exhibition | null {
  if (exhibitions.length === 0) return null;
  const explicit = exhibitions.find(e => e.active);
  if (explicit) return explicit;
  // Fallback: date-based
  const today    = new Date().toISOString().split("T")[0];
  const upcoming = exhibitions
    .filter(e => e.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (upcoming.length > 0) return upcoming[0];
  return [...exhibitions].sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
}

/**
 * Mark one exhibition as active and save it to Settings.
 */
export async function setActiveExhibition(id: string): Promise<void> {
  await ensureSheet();
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SETTINGS_TAB}!B1`,
    valueInputOption: "RAW",
    requestBody: { values: [[id]] },
  });
}

export async function deleteExhibition(id: string): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  // Resolve the numeric sheetId for the tab (needed by deleteDimension).
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets?.find((s) => s.properties?.title === TAB);
  const numericSheetId = sheet?.properties?.sheetId;
  if (numericSheetId === undefined || numericSheetId === null) {
    throw new Error("Exhibitions tab not found");
  }

  const rowNumber = await findRowNumber(id);
  if (rowNumber === null) throw new Error("Exhibition not found: " + id);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: numericSheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1, // 0-based, inclusive
              endIndex: rowNumber,       // exclusive
            },
          },
        },
      ],
    },
  });
}
