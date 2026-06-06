import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welland Valley Art Society — Volunteer Rota",
  description: "Exhibition stewarding rota for the Welland Valley Art Society.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="gallery">
      <body>{children}</body>
    </html>
  );
}
