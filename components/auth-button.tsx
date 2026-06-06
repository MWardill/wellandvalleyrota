import { auth, signIn, signOut } from "@/lib/auth";

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="flex items-center gap-3"
      >
        <span className="text-sm text-primary-content/80 hidden sm:inline">
          {session.user.email}
        </span>
        <button type="submit" className="btn btn-sm btn-outline">
          Sign out
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/settings" });
      }}
    >
      <button type="submit" className="btn btn-sm btn-secondary">
        Sign in with Google
      </button>
    </form>
  );
}
