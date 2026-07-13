"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { bookShiftAction, cancelBookingAction } from "@/actions/bookings";
import { SHIFTS, MAX_PER_SLOT } from "@/lib/shifts";
import {
  getExhibitionDates,
  getSpecialDay,
  getShiftSpecialDay,
  isDayClosed,
  isoDate,
  fmtLong,
  fmtShort,
  fmtWday,
} from "@/lib/rota-config";
import type { Exhibition, Booking } from "@/lib/types";

interface Props {
  exhibition: Exhibition;
  bookings:   Booking[];
}

export default function BookAShift({ exhibition, bookings }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<{
    date: string; shiftId: string; shiftLabel: string;
  } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<{
    id: string; name: string;
  } | null>(null);
  const [loadingSlot, setLoadingSlot] = useState<{
    date: string; shiftId: string;
  } | null>(null);
  const [formError,   setFormError]   = useState("");
  const [isPending, startTransition]  = useTransition();

  useEffect(() => {
    if (!isPending) {
      setLoadingSlot(null);
    }
  }, [isPending]);

  const bookingDialogRef = useRef<HTMLDialogElement>(null);
  const cancelDialogRef  = useRef<HTMLDialogElement>(null);
  const bookingFormRef   = useRef<HTMLFormElement>(null);

  const dates = getExhibitionDates(exhibition.startDate, exhibition.endDate);

  // Group dates into 7-day weeks for the date strip.
  const weeks: Date[][] = [];
  for (let i = 0; i < dates.length; i += 7) weeks.push(dates.slice(i, i + 7));

  function getSlot(dateKey: string, shiftId: string): Booking[] {
    return bookings.filter(b => b.date === dateKey && b.shiftId === shiftId);
  }

  function openBookingModal(date: string, shiftId: string, shiftLabel: string) {
    setPendingBooking({ date, shiftId, shiftLabel });
    setFormError("");
    bookingFormRef.current?.reset();
    bookingDialogRef.current?.showModal();
  }

  function openCancelModal(id: string, name: string) {
    setPendingCancel({ id, name });
    cancelDialogRef.current?.showModal();
  }

  function handleBookSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const formData = new FormData(e.currentTarget);
    if (pendingBooking) {
      setLoadingSlot({ date: pendingBooking.date, shiftId: pendingBooking.shiftId });
    }
    startTransition(async () => {
      const result = await bookShiftAction(formData);
      if (result.error) {
        setFormError(result.error);
        setLoadingSlot(null);
      } else {
        bookingDialogRef.current?.close();
        setPendingBooking(null);
      }
    });
  }

  function handleCancelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const booking = bookings.find(b => b.id === pendingCancel?.id);
    if (booking) {
      setLoadingSlot({ date: booking.date, shiftId: booking.shiftId });
    }
    startTransition(async () => {
      const result = await cancelBookingAction(formData);
      if (result.error) {
        console.error(result.error);
        setLoadingSlot(null);
      }
      cancelDialogRef.current?.close();
      setPendingCancel(null);
    });
  }

  return (
    <div>
      {/* Exhibition subtitle */}
      {exhibition.title && (
        <p className="font-display text-lg text-accent italic mb-4">
          {exhibition.title}
        </p>
      )}

      <p className="text-sm text-base-content/60 mb-6">
        Select a date to see available shifts. Each shift needs{" "}
        <strong>2 stewards</strong>. Click a shift to sign up.
      </p>

      {/* ── Date strip ────────────────────────────────────────────────────── */}
      <div className="mb-8">
        {weeks.map((week, wi) => (
          <div key={wi} className="mb-4">
            <div className="text-[11px] tracking-[0.1em] uppercase text-base-content/40 mb-2">
              Week {wi + 1}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {week.map(d => {
                const dk     = isoDate(d);
                const closed = isDayClosed(d, exhibition.startDate);
                const sp     = getSpecialDay(d, exhibition.startDate);

                if (closed) {
                  return (
                    <div
                      key={dk}
                      className="px-3 py-1.5 border border-base-300 bg-base-200
                                 text-base-content/35 text-center min-w-[62px] cursor-default"
                    >
                      <div className="text-[10px]">{fmtWday(d)}</div>
                      <div className="text-xs font-semibold">{fmtShort(d)}</div>
                      <div className="text-[10px] mt-0.5 leading-tight">
                        {sp?.type === "closed" ? sp.label : ""}
                      </div>
                    </div>
                  );
                }

                const totalBooked = SHIFTS.reduce(
                  (a, s) => a + getSlot(dk, s.id).length, 0
                );
                const bookableShifts = SHIFTS.filter(s =>
                  !getShiftSpecialDay(d, exhibition.startDate, s.id)?.noBook
                );
                const totalSlots = bookableShifts.length * MAX_PER_SLOT;
                const isFull   = totalBooked >= totalSlots;
                const isActive = selectedDate === dk;

                const statusClass = isActive
                  ? "bg-primary border-primary text-primary-content"
                  : isFull
                    ? "bg-red-100 border-red-400 text-red-800 hover:border-red-600"
                    : totalBooked > 0
                      ? "bg-amber-50 border-amber-400 text-amber-800 hover:border-amber-600"
                      : "bg-green-50 border-green-400 text-green-800 hover:border-green-600";

                return (
                  <button
                    key={dk}
                    onClick={() => setSelectedDate(dk)}
                    className={`px-3 py-1.5 border text-center min-w-[62px] text-sm transition-all ${statusClass}`}
                  >
                    <div className="text-[10px] opacity-70">{fmtWday(d)}</div>
                    <div className="font-semibold">{fmtShort(d)}</div>
                    {isFull && <div className="text-[10px] mt-0.5">Full</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Shift cards ───────────────────────────────────────────────────── */}
      {selectedDate && (() => {
        const d  = new Date(selectedDate + "T12:00:00");

        return (
          <div>
            <h3 className="font-display text-xl text-primary mb-4">
              {fmtLong(d)}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SHIFTS.map(shift => {
                const slotSp  = getShiftSpecialDay(d, exhibition.startDate, shift.id);
                const noBook  = slotSp?.noBook ?? false;
                const slotNote = slotSp?.note ?? null;

                const booked = getSlot(selectedDate, shift.id);
                const spaces = MAX_PER_SLOT - booked.length;

                const isSlotLoading = isPending && loadingSlot?.date === selectedDate && loadingSlot?.shiftId === shift.id;

                return (
                  <div
                    key={shift.id}
                    className="relative overflow-hidden border border-base-300 bg-white p-4
                               hover:shadow-sm transition-shadow"
                  >
                    {isSlotLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                      </div>
                    )}

                    {/* Shift time */}
                    <div className="text-sm font-semibold text-primary
                                    tracking-wide mb-2">
                      {shift.label}
                    </div>

                    {/* Optional slot note */}
                    {slotNote && (
                      <div className="text-[11px] text-secondary italic mb-2">
                        {slotNote}
                      </div>
                    )}

                    {noBook ? (
                      <div className="bg-base-200 text-primary text-center
                                      text-xs font-semibold py-2 mt-2 tracking-wide">
                        No booking required
                      </div>
                    ) : (
                      <>
                        {/* Booked people rows */}
                        <div className="mb-3">
                          {Array.from({ length: MAX_PER_SLOT }).map((_, i) => {
                            const person = booked[i];
                            return (
                              <div
                                key={i}
                                className={[
                                  "flex items-center justify-between py-1.5 min-h-[32px]",
                                  i > 0 ? "border-t border-base-200" : "",
                                ].join(" ")}
                              >
                                {person ? (
                                  <>
                                    <span className="text-sm text-base-content truncate mr-2">
                                      👤 {person.name}
                                    </span>
                                    <button
                                      onClick={() =>
                                        openCancelModal(person.id, person.name)
                                      }
                                      className="shrink-0 text-xs text-error border
                                                 border-error px-2 py-0.5
                                                 hover:bg-error hover:text-error-content
                                                 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs text-base-content/35 italic">
                                    Open slot
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Sign-up / full indicator */}
                        {spaces > 0 ? (
                          <button
                            onClick={() =>
                              openBookingModal(selectedDate, shift.id, shift.label)
                            }
                            className="w-full bg-primary text-primary-content
                                       text-sm font-semibold tracking-wide py-2
                                       hover:bg-neutral transition-colors"
                          >
                            Sign up
                          </button>
                        ) : (
                          <div className="bg-base-200 text-primary text-center
                                          text-xs font-semibold py-2 tracking-wide">
                            Shift Full
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── Booking modal ─────────────────────────────────────────────────── */}
      <dialog ref={bookingDialogRef} className="modal">
        <div className="modal-box bg-white rounded-none max-w-sm p-8 shadow-xl">
          <h3 className="font-display text-xl mb-1">Sign Up to Steward</h3>
          {pendingBooking && (
            <p className="text-sm text-base-content/55 mb-5">
              {pendingBooking.shiftLabel} ·{" "}
              {fmtLong(new Date(pendingBooking.date + "T12:00:00"))}
            </p>
          )}

          {formError && (
            <p className="text-error text-sm mb-3">{formError}</p>
          )}

          <form ref={bookingFormRef} onSubmit={handleBookSubmit}>
            {pendingBooking && (
              <>
                <input type="hidden" name="exhibitionId" value={exhibition.id} />
                <input type="hidden" name="date"         value={pendingBooking.date} />
                <input type="hidden" name="shiftId"      value={pendingBooking.shiftId} />
              </>
            )}

            <div className="mb-4">
              <label className="block text-xs font-semibold tracking-[0.08em]
                                uppercase text-base-content/55 mb-1.5">
                Your Name
              </label>
              <input
                type="text" name="name"
                placeholder="Full name"
                className="w-full px-3 py-2 border border-base-300 bg-base-100
                           text-sm focus:outline-none focus:border-primary"
                required
                autoComplete="name"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold tracking-[0.08em]
                                uppercase text-base-content/55 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel" name="phone"
                placeholder="e.g. 07700 900000"
                className="w-full px-3 py-2 border border-base-300 bg-base-100
                           text-sm focus:outline-none focus:border-primary"
                required
                autoComplete="tel"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-primary text-primary-content py-2 text-sm
                           font-semibold tracking-wide hover:bg-neutral
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Saving…" : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={() => bookingDialogRef.current?.close()}
                className="px-4 py-2 border border-primary text-primary text-sm
                           font-semibold hover:bg-primary hover:text-primary-content
                           transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* ── Cancel modal ──────────────────────────────────────────────────── */}
      <dialog ref={cancelDialogRef} className="modal">
        <div className="modal-box bg-white rounded-none max-w-sm p-8 shadow-xl">
          <h3 className="font-display text-xl text-error mb-3">
            Cancel Booking
          </h3>
          {pendingCancel && (
            <p className="text-sm text-base-content/70 mb-6">
              Remove <strong>{pendingCancel.name}</strong> from this shift?
              This cannot be undone.
            </p>
          )}
          <form onSubmit={handleCancelSubmit}>
            {pendingCancel && (
              <input type="hidden" name="id" value={pendingCancel.id} />
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 border border-error text-error text-sm
                           font-semibold hover:bg-error hover:text-error-content
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Cancelling…" : "Yes, Cancel Booking"}
              </button>
              <button
                type="button"
                onClick={() => cancelDialogRef.current?.close()}
                className="px-4 py-2 border border-primary text-primary text-sm
                           font-semibold hover:bg-primary hover:text-primary-content
                           transition-colors"
              >
                Keep It
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
