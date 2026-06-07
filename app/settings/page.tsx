import { Suspense } from "react";
import { auth, signIn } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/allowlist";
import ExhibitionForm from "@/components/exhibition-form";
import ExhibitionListWrapper from "@/components/exhibition-list-wrapper";

export default async function SettingsPage() {
  const session = await auth();
  const allowed = isAllowedEmail(session?.user?.email ?? null, process.env.ALLOWED_EMAILS);

  if (!allowed) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
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
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-primary">Exhibition settings</h1>
      </div>
      <ExhibitionForm />
      <section>
        <h2 className="font-display text-xl text-primary mb-3">Existing exhibitions</h2>
        <Suspense fallback={<div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
          <ExhibitionListWrapper />
        </Suspense>
      </section>
    </div>
  );
}
