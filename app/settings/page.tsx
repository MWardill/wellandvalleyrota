import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/allowlist";
import { listExhibitions } from "@/lib/exhibitions";
import SiteHeader from "@/components/site-header";
import ExhibitionForm from "@/components/exhibition-form";
import ExhibitionList from "@/components/exhibition-list";

export default async function SettingsPage() {
  const session = await auth();
  const allowed = isAllowedEmail(session?.user?.email ?? null, process.env.ALLOWED_EMAILS);

  if (!allowed) {
    return (
      <>
        <SiteHeader />
        <main className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
          <h1 className="font-display text-2xl text-primary">Settings</h1>
          <p className="text-base-content/70">
            This area is restricted. Please sign in with an authorised Google account.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/settings" });
            }}
          >
            <button type="submit" className="btn btn-primary">
              Sign in with Google
            </button>
          </form>
          <Link href="/" className="link text-sm">
            ← Back to the rota
          </Link>
        </main>
      </>
    );
  }

  const exhibitions = await listExhibitions();

  return (
    <>
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-primary">Exhibition settings</h1>
          <Link href="/" className="link text-sm">
            ← Back to the rota
          </Link>
        </div>
        <ExhibitionForm />
        <section>
          <h2 className="font-display text-xl text-primary mb-3">Existing exhibitions</h2>
          <ExhibitionList exhibitions={exhibitions} />
        </section>
      </main>
    </>
  );
}
