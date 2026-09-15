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
  description: "",
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
              "@type": "Organization",
              name: "Project-1",
              url: "https://draviya.com",
              logo: "https://draviya.com/images/logo/logo-icon.png",
              sameAs: [
                "https://x.com/athrix_codes",
                "https://github.com/Atharvsinh-codez/Project-1",
              ],
              description:
                "We’re turning your favorite creators into Investable tokens(similar to stocks). Buy, sell, and grow with the creators you believe in.",
            }),
          }}
        />
      </body>
    </html>
  );
}
