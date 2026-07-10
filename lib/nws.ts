// National Weather Service API (api.weather.gov). No API key required.

import { captureError } from "./logger";

const USER_AGENT = "SkywatchVB/0.1 (community flood safety site)";

export type NwsAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
  description: string;
  effective: string;
  ends: string | null;
};

export async function getActiveAlerts(lat: number, lng: number): Promise<NwsAlert[]> {
  try {
    const res = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat},${lng}`,
      { headers: { "User-Agent": USER_AGENT }, next: { revalidate: 300 } }
    );
    if (!res.ok) {
      captureError("nws.getActiveAlerts", `api.weather.gov responded ${res.status}`);
      return [];
    }
    const data = await res.json();
    return (data.features ?? []).map(
      (f: {
        id: string;
        properties: {
          event: string;
          headline: string;
          severity: string;
          description: string;
          effective: string;
          ends: string | null;
        };
      }) => ({
        id: f.id,
        event: f.properties.event,
        headline: f.properties.headline,
        severity: f.properties.severity,
        description: f.properties.description,
        effective: f.properties.effective,
        ends: f.properties.ends,
      })
    );
  } catch (err) {
    captureError("nws.getActiveAlerts", err);
    return [];
  }
}

export type NwsForecastPeriod = {
  name: string;
  shortForecast: string;
  temperature: number;
  isDaytime: boolean;
};

export async function getForecast(
  lat: number,
  lng: number
): Promise<NwsForecastPeriod[] | null> {
  try {
    const pointRes = await fetch(`https://api.weather.gov/points/${lat},${lng}`, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 },
    });
    if (!pointRes.ok) {
      captureError("nws.getForecast", `points lookup responded ${pointRes.status}`);
      return null;
    }
    const point = await pointRes.json();
    const forecastUrl = point.properties?.forecast;
    if (!forecastUrl) return null;

    const forecastRes = await fetch(forecastUrl, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 1800 },
    });
    if (!forecastRes.ok) {
      captureError("nws.getForecast", `forecast responded ${forecastRes.status}`);
      return null;
    }
    const forecast = await forecastRes.json();
    return (forecast.properties?.periods ?? []).map(
      (p: {
        name: string;
        shortForecast: string;
        temperature: number;
        isDaytime: boolean;
      }) => ({
        name: p.name,
        shortForecast: p.shortForecast,
        temperature: p.temperature,
        isDaytime: p.isDaytime,
      })
    );
  } catch (err) {
    captureError("nws.getForecast", err);
    return null;
  }
}

/** Flood-relevant alert event types we care about for the risk heuristic */
export function isFloodRelevantAlert(event: string): "warning" | "watch" | null {
  const e = event.toLowerCase();
  const isFlood = e.includes("flood") || e.includes("hurricane") || e.includes("surge") || e.includes("tropical storm");
  if (!isFlood) return null;
  if (e.includes("warning")) return "warning";
  if (e.includes("watch") || e.includes("advisory")) return "watch";
  return null;
}
