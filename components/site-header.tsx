import AuthButton from "./auth-button";

export default function SiteHeader() {
  return (
    <header className="bg-primary border-b-[3px] border-secondary">
      <div className="max-w-4xl mx-auto px-6 py-7 flex items-start justify-between gap-4">
        <div>
          <div className="text-secondary text-[11px] tracking-[0.18em] uppercase mb-1.5">
            Exhibition Stewarding
          </div>
          <h1 className="font-display text-2xl text-primary-content font-normal leading-tight">
            Welland Valley Art Society
            <br />
            <em className="text-xl">Volunteer Rota</em>
          </h1>
        </div>
        <div className="pt-1">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
