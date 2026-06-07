"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type TabDef = { id: string; label: string; href: string; requireAuthentication?: boolean };

export default function NavLinks({ tabs, isAuthenticated }: { tabs: TabDef[], isAuthenticated: boolean }) {
  const pathname = usePathname();

  const visibleTabs = tabs.filter(t => !t.requireAuthentication || isAuthenticated);

  return (
    <div role="tablist" className="tabs tabs-bordered">
      {visibleTabs.map((t) => {
        const isActive = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.id}
            href={t.href}
            role="tab"
            className={`tab ${isActive ? "tab-active" : ""}`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
