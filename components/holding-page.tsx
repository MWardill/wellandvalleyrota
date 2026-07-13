import Image from "next/image";
import HelpPage from "@/app/help/page";

export const BOOKING_OPENS_LABEL = "23 August 2026";

export default function HoldingPage() {
  return (
    <div>

      {/* Holding banner */}
      <div className="border-2 border-secondary bg-base-200 px-6 py-4 flex items-center gap-4 mb-6">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">🗓️</span>
        <div>
          <p className="font-display text-lg text-primary mb-1">Booking opens soon</p>
          <p className="text-sm leading-relaxed">
            This site will be active from <strong>{BOOKING_OPENS_LABEL}</strong> and will allow
            you to book Stewarding Shifts for the Welland Valley Art Society Autumn Exhibition.
            Please read the instructions below so you are ready to sign up as soon as booking opens.
          </p>
        </div>
      </div>

      {/* Exhibition photo */}
      <div className="mb-8 overflow-hidden">
        <Image
          src="/exhibition.jpg"
          alt="The Welland Valley Art Society Exhibition gallery"
          width={1400}
          height={260}
          className="w-full object-cover"
          style={{ height: "260px", objectPosition: "center 40%" }}
          priority
        />
        <p className="text-xs text-base-content/50 italic text-center mt-2">
          The WVAS Exhibition — come and be part of it
        </p>
      </div>

      {/* How to Use — reuse existing help page content */}
      <HelpPage />

    </div>
  );
}
