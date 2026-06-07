import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import SiteHeader from "@/components/site-header";
import NavTabs from "@/components/nav-tabs";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Welland Valley Art Society — Volunteer Rota",
  description: "Exhibition stewarding rota for the Welland Valley Art Society.",
};

const TABS = [
  { id: "book", label: "Book a Shift", href: "/" },
  { id: "overview", label: "Full Overview", href: "/overview" },
  { id: "booked", label: "Who's Booked", href: "/booked" },
  { id: "settings", label: "Settings", href: "/settings", requireAuthentication: true },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Vercel automatically populates this environment variable at build time
  const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "dev";

  return (
    <html lang="en" data-theme="gallery" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
        <SiteHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <NavTabs tabs={TABS} />
          {children}
        </main>
        <div className="fixed bottom-2 right-3 text-[10px] text-base-content/30 font-mono pointer-events-none select-none z-50">
          rev {commitSha}
        </div>
      </body>
    </html>
  );
}
