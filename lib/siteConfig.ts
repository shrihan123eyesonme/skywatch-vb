// Central place for the handful of values that legal/contact copy needs.
// CONTACT_EMAIL defaults to a placeholder at the real domain — this inbox
// isn't live until email hosting or forwarding is set up for skywatchvb.org
// (Porkbun sells both; forwarding is the free option). Set
// NEXT_PUBLIC_CONTACT_EMAIL once that's done, and both legal pages update
// automatically.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@skywatchvb.org";

export const LEGAL_LAST_UPDATED = "July 9, 2026";

// Used by sitemap.ts, robots.ts, and Open Graph tags. skywatchvb.org is
// registered (Porkbun) as of Sept 2026 — this becomes the real, live URL
// once it's added as a domain in the Vercel project and DNS is pointed at
// Vercel. Until that DNS step is done, the .vercel.app URL is still what
// actually resolves.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://skywatchvb.org";
