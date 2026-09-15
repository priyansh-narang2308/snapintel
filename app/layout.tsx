import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://draviya.com"),
  title: {
    default: "SnapIntel: Visual Intelligence & Decision Engine",
    template: "%s | SnapIntel",
  },
  description:
    "SnapIntel is an autonomous visual intelligence and market decision engine powered by SerpApi Google Lens, live merchant pricing, Reddit consensus, and OpenRouter AI verdicts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} antialiased overflow-x-hidden`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SnapIntel",
              url: "https://snapintel.app",
              description:
                "Multi-engine visual market intelligence and buying verdict platform.",
            }),
          }}
        />
      </body>
    </html>
  );
}
