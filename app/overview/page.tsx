import { listExhibitions, getActiveExhibition } from "@/lib/exhibitions";
import { listBookings } from "@/lib/bookings";
import { formatPhone } from "@/lib/format";
import {
  getExhibitionDates,
  getSpecialDay,
  getShiftSpecialDay,
  isDayClosed,
  isoDate,
  fmtShort,
  fmtWday,
} from "@/lib/rota-config";
import { SHIFTS, MAX_PER_SLOT } from "@/lib/shifts";
import type { Booking } from "@/lib/types";

export default async function OverviewPage() {
  const exhibitions = await listExhibitions();
  const active      = getActiveExhibition(exhibitions);

  if (!active) {
    return (
      <div className="border border-base-300 bg-base-200 p-10 text-center">
        <h2 className="font-display text-2xl text-primary mb-2">
          No Exhibition Scheduled
        </h2>
        <p className="text-base-content/60">Check back soon.</p>
      </div>
    );
  }

  const bookings = await listBookings(active.id);
  const dates    = getExhibitionDates(active.startDate, active.endDate);

  function getSlot(dateKey: string, shiftId: string): Booking[] {
    return bookings.filter(b => b.date === dateKey && b.shiftId === shiftId);
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-primary mb-1">
        Full Rota Overview
      </h2>
      {active.title && (
        <p className="font-display text-base text-accent italic mb-1">
          {active.title}
        </p>
      )}
      <p className="text-sm text-base-content/60 mb-6">
        All days at a glance. Shifts still needing volunteers are highlighted.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-primary-content">
              <th className="px-3.5 py-2.5 text-left font-semibold
                             tracking-wide whitespace-nowrap">
                Date
              </th>
              {SHIFTS.map(s => (
                <th
                  key={s.id}
                  className="px-3.5 py-2.5 text-left font-semibold
                             tracking-wide whitespace-nowrap"
                >
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((d, idx) => {
              const dk     = isoDate(d);
              const sp     = getSpecialDay(d, active.startDate);
              const closed = isDayClosed(d, active.startDate);
              const rowBg  = idx % 2 === 0 ? "bg-white" : "bg-base-100";

              return (
                <tr key={dk}>
                  {/* Date cell */}
                  <td className={`px-3.5 py-2 border-l border-base-200
                                  ${rowBg} whitespace-nowrap align-top`}>
                    <div className="font-semibold text-primary text-xs">
                      {fmtWday(d)}
                    </div>
                    <div className="text-xs text-base-content/55">
                      {fmtShort(d)}
                    </div>
                  </td>

                  {/* Shift cells */}
                  {closed
                    ? SHIFTS.map(s => (
                        <td
                          key={s.id}
                          className={`px-3.5 py-2 border-l border-base-200
                                      ${rowBg} text-xs text-base-content/45 italic`}
                        >
                          {sp?.type === "closed" ? sp.label : ""}
                        </td>
                      ))
                    : SHIFTS.map(shift => {
                        const slotSp  = getShiftSpecialDay(d, active.startDate, shift.id);
                        const noBook  = slotSp?.noBook ?? false;
                        const slotNote = slotSp?.note ?? null;
                        const booked  = getSlot(dk, shift.id);

                        return (
                          <td
                            key={shift.id}
                            className={`px-3.5 py-2 border-l border-base-200
                                        ${rowBg} align-top`}
                          >
                            {noBook ? (
                              <span className="text-xs text-base-content/45 italic">
                                {slotNote}
                              </span>
                            ) : booked.length === 0 ? (
                              <>
                                <span className="text-base-content/25 italic text-xs">—</span>
                                <div className="text-[11px] text-secondary mt-0.5">
                                  {MAX_PER_SLOT} needed
                                </div>
                              </>
                            ) : (
                              <>
                                {booked.map(p => (
                                  <div key={p.id} className="text-xs">
                                    {p.name}
                                    {p.phone && (
                                      <span className="text-base-content/45">
                                        {" "}· {formatPhone(p.phone)}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {booked.length < MAX_PER_SLOT && (
                                  <div className="text-[11px] text-secondary mt-0.5">
                                    +{MAX_PER_SLOT - booked.length} needed
                                  </div>
                                )}
                                {slotNote && !noBook && (
                                  <div className="text-[11px] text-base-content/45
                                                  italic mt-0.5">
                                    {slotNote}
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        );
                      })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
