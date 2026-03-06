import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yevanupdates.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Yevan Updates | FIA Formula 3 — AIX Racing",
  description:
    "Follow Yevan David's 2026 FIA Formula 3 Championship season with AIX Racing. Live timing, standings, race calendar and results.",
  keywords: [
    "Yevan David",
    "Formula 3",
    "FIA F3",
    "AIX Racing",
    "motorsport",
    "2026",
  ],
  openGraph: {
    title: "Yevan Updates | FIA Formula 3 — AIX Racing",
    description:
      "Live standings, race calendar and timing for Yevan David's 2026 FIA F3 season.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yevan Updates | FIA Formula 3 — AIX Racing",
    description:
      "Live standings, race calendar and timing for Yevan David's 2026 FIA F3 season.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground font-body antialiased">
        {children}
      </body>
    </html>
  );
}
