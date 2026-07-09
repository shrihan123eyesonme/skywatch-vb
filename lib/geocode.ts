// Geocoding via OpenStreetMap Nominatim. No API key required. Server-side
// only (route handler) — Nominatim's usage policy requires a descriptive
// User-Agent and no more than ~1 request/second.

const USER_AGENT = "SkywatchVB/0.1 (community flood safety site)";

// Roughly the City of Virginia Beach bounding box, used to bias/limit results
// so "Main St" resolves locally instead of some other state.
const VB_VIEWBOX = "-76.28,36.55,-75.85,36.95";

export type GeocodeResult = {
  lat: number;
  lng: number;
  displayName: string;
};

export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "1",
    countrycodes: "us",
    viewbox: VB_VIEWBOX,
    bounded: "0",
  });

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      { headers: { "User-Agent": USER_AGENT } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const first = data[0];
    return {
      lat: parseFloat(first.lat),
      lng: parseFloat(first.lon),
      displayName: first.display_name,
    };
  } catch {
    return null;
  }
}
