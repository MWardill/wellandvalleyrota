import Image from "next/image";

const EXHIBITION_DATES = [
  { label: "Entry Opens", value: "Sun 23 Aug" },
  { label: "Entry Closes", value: "Fri 18 Sep" },
  { label: "Hand-In", value: "Mon 28 Sep · 9:30–10:30am" },
  { label: "Private Preview", value: "Tue 29 Sep (TBC)" },
  { label: "Exhibition Dates", value: "29 Sep – 17 Oct" },
  { label: "Collect Unsold Work", value: "Mon 19 Oct · 9am–12noon" },
];

export default function SiteHeader() {
  return (
    <header className="bg-primary border-b-[3px] border-secondary">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-5">
        <Image
          src="/wvas-mark.jpg"
          alt="Welland Valley Art Society"
          width={72}
          height={72}
          className="flex-shrink-0 bg-white object-contain p-1"
          priority
        />
        <div>
          <p className="text-secondary text-[11px] tracking-[0.18em] uppercase mb-1">
            Welland Valley Art Society
          </p>
          <h1 className="font-display text-2xl text-primary-content font-normal leading-tight">
            Exhibition Stewarding Rota
          </h1>
        </div>
      </div>
      <div
        className="border-t border-primary-content/10"
        style={{ background: "var(--wvas-green-mid)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap">
          {EXHIBITION_DATES.map((d, i) => (
            <div
              key={d.label}
              className={`px-3 py-2 flex-1 basis-1/2 sm:basis-auto min-w-0 ${
                i < EXHIBITION_DATES.length - 1 ? "border-r border-primary-content/10" : ""
              }`}
            >
              <span className="block text-[9px] tracking-[0.10em] uppercase text-secondary mb-0.5 whitespace-nowrap">
                {d.label}
              </span>
              <span className="text-xs text-primary-content font-semibold whitespace-nowrap">
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
