/**
 * Format a UK phone number as "0xxxx xxxxxx" (5+6 digits).
 * Converts +44 international prefix to leading 0 before formatting.
 * Any value that isn't exactly 11 digits (after normalisation) is returned
 * unchanged — so "none", "N/A", or any freetext passes through safely.
 */
export function formatPhone(raw: string): string {
  let digits = raw.replace(/[\s\-().+]/g, "");
  if (/^44\d{10}$/.test(digits)) digits = "0" + digits.slice(2);
  if (/^\d{11}$/.test(digits)) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return raw;
}
