"use server";

import { revalidatePath } from "next/cache";
import { listBookings, createBooking, deleteBooking } from "@/lib/bookings";
import { SHIFTS, MAX_PER_SLOT } from "@/lib/shifts";

const ALL_PATHS = ["/", "/overview", "/booked"] as const;

function revalidateAll() {
  ALL_PATHS.forEach(p => revalidatePath(p));
}

export async function bookShiftAction(
  formData: FormData,
): Promise<{ error?: string }> {
  const exhibitionId = String(formData.get("exhibitionId") ?? "").trim();
  const date         = String(formData.get("date")         ?? "").trim();
  const shiftId      = String(formData.get("shiftId")      ?? "").trim();
  const name         = String(formData.get("name")         ?? "").trim();
  const phone        = String(formData.get("phone")        ?? "").trim();

  if (!name)  return { error: "Please enter your name." };
  if (!phone) return { error: "Please enter your phone number." };
  if (!SHIFTS.find(s => s.id === shiftId)) return { error: "Invalid shift." };

  // Re-read the slot before writing to guard against concurrent bookings.
  const bookings  = await listBookings(exhibitionId);
  const slotCount = bookings.filter(b => b.date === date && b.shiftId === shiftId).length;
  if (slotCount >= MAX_PER_SLOT) {
    return { error: "This shift is now full — please choose another." };
  }

  await createBooking({ exhibitionId, date, shiftId, name, phone });
  revalidateAll();
  return {};
}

export async function cancelBookingAction(
  formData: FormData,
): Promise<{ error?: string }> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing booking id." };
  await deleteBooking(id);
  revalidateAll();
  return {};
}
