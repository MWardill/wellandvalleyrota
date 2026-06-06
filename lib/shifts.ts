// Shift definitions for the rota. Kept as a constant for now (matches the
// original app); may become per-exhibition configuration in a later phase.
export interface Shift {
  id: string;
  label: string;
}

export const SHIFTS: Shift[] = [
  { id: "s1", label: "10:00am – 1:30pm" },
  { id: "s2", label: "1:30pm – 5:00pm" },
  { id: "s3", label: "5:00pm – Closing" },
];

export const MAX_PER_SLOT = 2;
