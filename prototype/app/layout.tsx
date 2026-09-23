import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Warhammer Data Cards",
  description: "Speak a unit name and open its Warhammer 40,000 datasheet. A private tabletop companion.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Warhammer Data Cards", statusBarStyle: "black-translucent" },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/warhammer-mark.svg",
    shortcut: "/warhammer-mark.svg",
    apple: "/warhammer-apple-touch.png",
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
