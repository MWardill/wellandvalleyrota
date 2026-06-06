export default function ComingSoon({ feature }: { feature: string }) {
  return (
    <div className="border border-base-300 bg-base-200 p-10 text-center">
      <h2 className="font-display text-2xl text-primary mb-2">{feature}</h2>
      <p className="text-base-content/70">
        This part of the rota is coming soon.
      </p>
    </div>
  );
}
