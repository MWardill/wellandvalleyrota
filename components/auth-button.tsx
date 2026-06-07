import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/lib/auth";

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-circle btn-sm btn-ghost overflow-hidden p-0"
          title="Account menu"
          aria-label="Account menu"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="Profile picture"
              width={32}
              height={32}
              className="w-8 h-8 object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-primary-content/20 flex items-center justify-center text-primary-content font-bold uppercase text-sm">
              {session.user.email?.[0] ?? "?"}
            </div>
          )}
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-2">
          <li>
            <Link href="/settings">Settings</Link>
          </li>
          <li>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
              className="w-full flex"
            >
              <button type="submit" className="w-full text-left">
                Sign Out
              </button>
            </form>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className="btn btn-circle btn-sm bg-base-300 hover:bg-base-300/80 border-none"
        title="Sign in with Google"
        aria-label="Sign in with Google"
      >
        <svg
          className="w-7 h-7 text-base-content/60"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      </button>
    </form>
  );
}
