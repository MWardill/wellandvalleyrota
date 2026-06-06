"use client";

import { useState } from "react";
import Link from "next/link";
import ComingSoon from "./coming-soon";

const TABS = [
  { id: "book", label: "Book a Shift" },
  { id: "overview", label: "Full Overview" },
  { id: "booked", label: "Who's Booked" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function NavTabs() {
  const [active, setActive] = useState<TabId>("book");

  const labels: Record<TabId, string> = {
    book: "Book a Shift",
    overview: "Full Overview",
    booked: "Who's Booked",
  };

  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`tab ${active === t.id ? "tab-active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
        <Link href="/settings" className="tab" role="tab">
          Settings
        </Link>
      </div>
      <ComingSoon feature={labels[active]} />
    </div>
  );
}
