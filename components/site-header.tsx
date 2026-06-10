import Image from "next/image";

interface Props {
  dateRange?: string | null;
}

export default function SiteHeader({ dateRange }: Props) {
  return (
    <header className="bg-primary border-b-[3px] border-secondary">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-secondary text-[11px] tracking-[0.18em] uppercase mb-1.5">
            Exhibition Stewarding
          </div>
          <h1 className="font-display text-2xl text-primary-content font-normal leading-tight">
            Welland Valley Art Society
            <br />
            <em className="text-xl">Stewarding Rosta</em>
          </h1>
          {dateRange && (
            <p className="text-primary-content/70 text-xs mt-1.5 tracking-wide">
              {dateRange}
            </p>
          )}
        </div>
        <Image
          src="/wvas-logo.jpg"
          alt="Welland Valley Art Society"
          width={225}
          height={225}
          className="object-contain flex-shrink-0"
          priority
        />
      </div>
    </header>
  );
}
