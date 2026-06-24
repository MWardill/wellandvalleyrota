import Image from "next/image";

interface Props {
  dateRange?: string | null;
}

export default function SiteHeader({ dateRange }: Props) {
  return (
    <header className="bg-primary border-b-[3px] border-secondary">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary-content font-normal leading-tight">
            Welland Valley Art Society
            <br />
            <em className="text-xl">Exhibition Stewarding Rota</em>
          </h1>
          {dateRange && (
            <p className="text-primary-content/70 text-xs mt-1.5 tracking-wide">
              {dateRange}
            </p>
          )}
        </div>
        <a
          href="https://www.wellandvalleyartsociety.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block flex-shrink-0"
          aria-label="Visit the Welland Valley Art Society website"
        >
          <Image
            src="/wvas-logo.jpg"
            alt="Welland Valley Art Society"
            width={240}
            height={110}
            className="object-contain"
            priority
          />
        </a>
      </div>
    </header>
  );
}
