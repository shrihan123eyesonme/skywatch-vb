// Central place for the handful of values that legal/contact copy needs.
// CONTACT_EMAIL defaults to a placeholder — set NEXT_PUBLIC_CONTACT_EMAIL
// once you have a real domain and inbox, and both legal pages update
// automatically.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@skywatchvb.com";

export const LEGAL_LAST_UPDATED = "July 9, 2026";
