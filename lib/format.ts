/**
 * Format a UK phone number as "0xxxx xxxxxx" (5+6 digits).
 * Any value that isn't exactly 11 digits (after stripping spaces/dashes/brackets)
 * is returned unchanged — so "none", "N/A", or any freetext passes through safely.
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/[\s\-().+]/g, "");
  if (/^\d{11}$/.test(digits)) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return raw;
}
