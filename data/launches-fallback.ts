// Fallback NASA Wallops launch info, used when live schedule data can't be
// fetched. NASA does not publish a stable public API for the Wallops launch
// schedule (dates are typically released less than 2 months out and change
// often), so this list is hand-researched and needs periodic refreshing.
//
// Checked 2026-07-09 against NASA Wallops blog posts (nasa.gov/blogs/wallops)
// and https://www.nasa.gov/wallops-launch-schedule/. Treat as a snapshot, not
// a live feed — the launch tracker page always links out to the official
// schedule so visitors can double-check.

export type LaunchEntry = {
  missionName: string;
  vehicle: string;
  window: string;
  status: "scheduled" | "completed" | "tbd";
  sourceUrl: string;
};

export const launchesFallback: LaunchEntry[] = [
  {
    missionName: "Department of War suborbital sounding rocket mission",
    vehicle: "Sounding rocket",
    window: "June 26 – July 2, 2026",
    status: "completed",
    sourceUrl:
      "https://www.nasa.gov/blogs/wallops/2026/06/23/nasa-wallops-to-support-launch-beginning-late-june/",
  },
  {
    missionName: "INCUS (Investigation of Convective Updrafts)",
    vehicle: "Firefly Aerospace vehicle",
    window: "Projected October 2026 (date TBD)",
    status: "tbd",
    sourceUrl: "https://www.nasa.gov/wallops-launch-schedule/",
  },
  {
    missionName: "Cygnus resupply mission to the ISS",
    vehicle: "Antares 300 (Northrop Grumman)",
    window: "Projected December 2026 (date TBD)",
    status: "tbd",
    sourceUrl: "https://www.nasa.gov/wallops-launch-schedule/",
  },
];

// Wallops Island, VA pad complex vs. Virginia Beach oceanfront.
export const WALLOPS_COORDS = { lat: 37.9401, lng: -75.4664 };
export const VIRGINIA_BEACH_COORDS = { lat: 36.8508, lng: -75.9773 };

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance in miles */
export function distanceMiles(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
) {
  const R = 3958.8;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Compass bearing (degrees) to look from `from` toward `to` */
export function bearingDegrees(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
) {
  const y =
    Math.sin(toRad(to.lng - from.lng)) * Math.cos(toRad(to.lat));
  const x =
    Math.cos(toRad(from.lat)) * Math.sin(toRad(to.lat)) -
    Math.sin(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.cos(toRad(to.lng - from.lng));
  const deg = (Math.atan2(y, x) * 180) / Math.PI;
  return (deg + 360) % 360;
}

const COMPASS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

export function bearingToCompass(deg: number) {
  return COMPASS[Math.round(deg / 22.5) % 16];
}

export const wallopsFromVirginiaBeach = {
  distanceMiles: Math.round(
    distanceMiles(VIRGINIA_BEACH_COORDS, WALLOPS_COORDS)
  ),
  bearingCompass: bearingToCompass(
    bearingDegrees(VIRGINIA_BEACH_COORDS, WALLOPS_COORDS)
  ),
};
