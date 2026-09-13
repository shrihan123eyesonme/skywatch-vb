import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertBanner } from "@/components/layout/AlertBanner";
import { SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Skywatch VB — Virginia Beach flood watch & community hub";
const DESCRIPTION =
  "A Virginia Beach community resource: know your flood risk today, and see what's happening around the city.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Skywatch VB",
  },
  description: DESCRIPTION,
  authors: [{ name: "Shrihan" }],
  creator: "Shrihan",
  keywords: [
    "Virginia Beach flooding",
    "Virginia Beach flood risk",
    "Hampton Roads flood alerts",
    "Skywatch VB",
    "Virginia Beach community",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Skywatch VB",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf9f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b282c" },
  ],
};

// WebSite structured data so search engines connect the name, URL, and
// description — the parts of the site's identity that live outside any page.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Skywatch VB",
  url: SITE_URL,
  description: DESCRIPTION,
  author: {
    "@type": "Person",
    name: "Shrihan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ocean-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-sand-50"
        >
          Skip to main content
        </a>
        <Suspense fallback={null}>
          <AlertBanner />
        </Suspense>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* Cookie-less visitor counting; only active once Web Analytics is
            enabled on the Vercel project (no-op in local dev). */}
        <Analytics />
      </body>
    </html>
  );
}
