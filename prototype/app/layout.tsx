import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Cards — Warhammer Companion",
  description: "Speak a unit name and open its Warhammer 40,000 datasheet. A private tabletop companion.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Field Cards", statusBarStyle: "black-translucent" },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
