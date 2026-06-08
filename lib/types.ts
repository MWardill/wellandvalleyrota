export interface ExhibitionInput {
  societyName: string;
  title: string; // may be empty
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
}

export interface Exhibition extends ExhibitionInput {
  id: string;
  active: boolean;   // true = shown on the public rota views
  createdAt: string; // ISO timestamp
}

export const DEFAULT_SOCIETY_NAME = "Welland Valley Art Society";

// ── Bookings ──────────────────────────────────────────────────────────────────

export interface BookingInput {
  exhibitionId: string;
  date: string;    // ISO YYYY-MM-DD
  shiftId: string;
  name: string;
  phone: string;
}

export interface Booking extends BookingInput {
  id: string;
  createdAt: string; // ISO timestamp
}
