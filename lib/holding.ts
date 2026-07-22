import { auth } from "@/lib/auth";

// Booking opens on this date. Change this for each new exhibition.
export const BOOKING_OPENS = new Date("2026-08-23T00:00:00");

export async function isHoldingNow(): Promise<boolean> {
  const session = await auth();
  return new Date() < BOOKING_OPENS && !session?.user;
}
