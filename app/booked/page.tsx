import { listExhibitions, getActiveExhibition } from "@/lib/exhibitions";
import { listBookings } from "@/lib/bookings";
import {
  getExhibitionDates,
  getSpecialDay,
  isDayClosed,
  isoDate,
  fmtLong,
  type SpecialDaySlotNote,
} from "@/lib/rota-config";
import { SHIFTS } from "@/lib/shifts";

export default async function BookedPage() {
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

  // Aggregate volunteers: one entry per unique name+phone with all their shifts.
  type PersonEntry = {
    name:   string;
    phone:  string;
    shifts: { date: Date; shiftLabel: string }[];
  };
  const people: Record<string, PersonEntry> = {};

  dates.forEach(d => {
    if (isDayClosed(d, active.startDate)) return;
    const dk = isoDate(d);
    SHIFTS.forEach(shift => {
      const sp = getSpecialDay(d, active.startDate);
      if (
        sp?.type === "slot-note" &&
        sp.shiftId === shift.id &&
        (sp as SpecialDaySlotNote).noBook
      ) return;

      bookings
        .filter(b => b.date === dk && b.shiftId === shift.id)
        .forEach(b => {
          const key = b.name.trim().toLowerCase();
          if (!people[key]) {
            people[key] = { name: b.name.trim(), phone: b.phone.trim(), shifts: [] };
          }
          people[key].shifts.push({ date: d, shiftLabel: shift.label });
        });
    });
  });

  const entries = Object.values(people);

  if (entries.length === 0) {
    return (
      <div>
        <h2 className="font-display text-2xl text-primary mb-2">
          Who&apos;s Booked
        </h2>
        <p className="text-sm text-base-content/45 py-3">No bookings yet.</p>
      </div>
    );
  }

  // Sort alphabetically: surname first, then first name.
  const surname = (n: string) =>
    n.trim().split(/\s+/).slice(-1)[0].toLowerCase();
  const firstName = (n: string) =>
    n.trim().split(/\s+/)[0].toLowerCase();

  entries.sort((a, b) => {
    const sa = surname(a.name),   sb = surname(b.name);
    if (sa !== sb) return sa < sb ? -1 : 1;
    return firstName(a.name) < firstName(b.name) ? -1 : 1;
  });
  entries.forEach(e => e.shifts.sort((a, b) => a.date.getTime() - b.date.getTime()));

  return (
    <div>
      <h2 className="font-display text-2xl text-primary mb-1">
        Who&apos;s Booked
      </h2>
      {active.title && (
        <p className="font-display text-base text-accent italic mb-1">
          {active.title}
        </p>
      )}
      <p className="text-sm text-base-content mb-6">
        All volunteers who have committed, listed alphabetically by surname.
      </p>

      <div className="divide-y divide-base-300">
        {entries.map(entry => (
          <div key={entry.name.toLowerCase()} className="py-4">
            <div className="font-semibold text-[15px] text-primary">
              {entry.name}
            </div>
            {entry.phone && (
              <div className="text-xs text-base-content/45 mb-1.5">
                {entry.phone}
              </div>
            )}
            <div className="space-y-0.5 mt-1">
              {entry.shifts.map((s, i) => (
                <div key={i} className="text-sm text-base-content/65 pl-2.5">
                  {fmtLong(s.date)} · {s.shiftLabel}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
