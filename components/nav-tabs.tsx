import { auth } from "@/lib/auth";
import AuthButton from "./auth-button";
import NavLinks, { TabDef } from "./nav-links";

export default async function NavTabs({ tabs }: { tabs: TabDef[] }) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="flex items-end justify-between border-b border-base-300 mb-6">
      <NavLinks tabs={tabs} isAuthenticated={isAuthenticated} />
      <div className="pb-1">
        <AuthButton />
      </div>
    </div>
  );
}
