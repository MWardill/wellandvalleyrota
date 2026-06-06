import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="gallery" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>{children}</body>
    </html>
  );
}
