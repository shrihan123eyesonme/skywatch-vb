// Structured error logging for the external calls this app depends on
// (NOAA, NWS, Nominatim, the Wallops scrape). Every one of those calls
// fails silently to a fallback today (that's intentional — a slow NOAA API
// shouldn't 500 the homepage) but a silent fallback is also how an outage
// goes unnoticed for days. This makes failures visible without requiring
// any third-party account:
//
// - Locally / in `vercel dev`, these show up in your terminal.
// - On Vercel, every console.error is captured in Runtime Logs
//   (vercel.com/<team>/<project>/logs) automatically, no setup needed.
//
// To upgrade to a dedicated monitoring service later (Sentry, Better Stack,
// etc.), the only change needed is inside `captureError` below — every call
// site already goes through this one function.
export function captureError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    JSON.stringify({
      level: "error",
      context,
      message,
      time: new Date().toISOString(),
    })
  );
}
