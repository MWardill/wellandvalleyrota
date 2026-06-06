import type { ExhibitionInput } from "./types";

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: Partial<Record<keyof ExhibitionInput, string>> };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateExhibitionInput(input: ExhibitionInput): ValidationResult {
  const errors: Partial<Record<keyof ExhibitionInput, string>> = {};

  if (!input.societyName || input.societyName.trim() === "") {
    errors.societyName = "Society name is required.";
  }

  if (!input.startDate) {
    errors.startDate = "Start date is required.";
  } else if (!ISO_DATE.test(input.startDate)) {
    errors.startDate = "Start date must be a valid date.";
  }

  if (!input.endDate) {
    errors.endDate = "End date is required.";
  } else if (!ISO_DATE.test(input.endDate)) {
    errors.endDate = "End date must be a valid date.";
  }

  if (!errors.startDate && !errors.endDate && input.endDate < input.startDate) {
    errors.endDate = "End date cannot be before the start date.";
  }

  return Object.keys(errors).length === 0 ? { ok: true } : { ok: false, errors };
}
