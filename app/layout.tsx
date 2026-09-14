import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Fraunces, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertBanner } from "@/components/layout/AlertBanner";
import { SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

// Fraunces (a warm, opinionated serif with real optical-size personality) for
// headlines, Manrope for body/UI — deliberately not the Geist/Inter default
// stack every AI-generated site ships with.
const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
});

const manrope = Manrope({
  variable: "--font-body",
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
  authors: [{ name: "Shrihan Mishra" }],
  creator: "Shrihan Mishra",
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
  // Tells search engines "skywatchvb" (no space, matching the domain) is
  // the same entity as "Skywatch VB" — the standard schema.org property
  // for this, not a hack. Doesn't force Google's spell-correction to
  // change instantly, but it's real signal that accumulates over time.
  alternateName: "SkywatchVB",
  url: SITE_URL,
  description: DESCRIPTION,
  author: {
    "@type": "Person",
    name: "Shrihan Mishra",
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
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
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
