import { listExhibitions, getActiveExhibition } from "@/lib/exhibitions";
import { listBookings } from "@/lib/bookings";
import { isHoldingNow } from "@/lib/holding";
import HoldingPage from "@/components/holding-page";
import BookAShift from "@/components/book-a-shift";

export default async function BookPage() {
  if (await isHoldingNow()) return <HoldingPage />;

  const exhibitions = await listExhibitions();
  const active      = getActiveExhibition(exhibitions);

  if (!active) {
    return (
      <div className="border border-base-300 bg-base-200 p-10 text-center">
        <h2 className="font-display text-2xl text-primary mb-2">
          No Exhibition Scheduled
        </h2>
        <p className="text-base-content/60">
          Check back soon, or contact the society for details.
        </p>
      </div>
    );
  }

  const bookings = await listBookings(active.id);
  return <BookAShift exhibition={active} bookings={bookings} />;
}
