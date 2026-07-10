// NOAA data for the Hampton Roads / Virginia Beach area. No API key required.
//
// Primary source: NOAA's National Water Prediction Service gauge SWPV2
// ("James River (VA) at Sewell's Point"), which publishes the same
// action/minor/moderate/major flood-stage thresholds the National Weather
// Service uses operationally, plus a live observed/forecast flood category.
// Verified live 2026-07-09: action 4.0 ft, minor 4.5 ft, moderate 5.5 ft,
// major 6.5 ft (all referenced to MLLW).
//
// Secondary source: NOAA CO-OPS Tides & Currents station 8638610
// (Sewells Point), used for the tide prediction chart.

import { captureError } from "./logger";

const NWPS_GAUGE_URL = "https://api.water.noaa.gov/nwps/v1/gauges/SWPV2";
const COOPS_BASE = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
const COOPS_STATION = "8638610";

const USER_AGENT = "SkywatchVB/0.1 (community flood safety site)";

export type FloodCategory =
  | "no_flooding"
  | "action"
  | "minor"
  | "moderate"
  | "major"
  | "unknown";

export type FloodGaugeStatus = {
  observed: { stageFt: number; category: FloodCategory; validTime: string } | null;
  forecast: { stageFt: number; category: FloodCategory; validTime: string } | null;
  thresholds: {
    actionFt: number | null;
    minorFt: number | null;
    moderateFt: number | null;
    majorFt: number | null;
  };
  stationName: string;
};

export async function getFloodGaugeStatus(): Promise<FloodGaugeStatus | null> {
  try {
    const res = await fetch(NWPS_GAUGE_URL, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      captureError("noaa.getFloodGaugeStatus", `NWPS responded ${res.status}`);
      return null;
    }
    const data = await res.json();

    return {
      observed: data.status?.observed
        ? {
            stageFt: data.status.observed.primary,
            category: (data.status.observed.floodCategory ?? "unknown") as FloodCategory,
            validTime: data.status.observed.validTime,
          }
        : null,
      forecast: data.status?.forecast
        ? {
            stageFt: data.status.forecast.primary,
            category: (data.status.forecast.floodCategory ?? "unknown") as FloodCategory,
            validTime: data.status.forecast.validTime,
          }
        : null,
      thresholds: {
        actionFt: data.flood?.categories?.action?.stage ?? null,
        minorFt: data.flood?.categories?.minor?.stage ?? null,
        moderateFt: data.flood?.categories?.moderate?.stage ?? null,
        majorFt: data.flood?.categories?.major?.stage ?? null,
      },
      stationName: data.name ?? "Sewells Point",
    };
  } catch (err) {
    captureError("noaa.getFloodGaugeStatus", err);
    return null;
  }
}

export type TidePrediction = { time: string; type: "H" | "L"; valueFt: number };

export async function getTidePredictionsToday(): Promise<TidePrediction[] | null> {
  try {
    const params = new URLSearchParams({
      station: COOPS_STATION,
      product: "predictions",
      datum: "MLLW",
      time_zone: "lst_ldt",
      units: "english",
      format: "json",
      date: "today",
      interval: "hilo",
    });
    const res = await fetch(`${COOPS_BASE}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      captureError("noaa.getTidePredictionsToday", `CO-OPS responded ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (!data.predictions) return null;
    return data.predictions.map((p: { t: string; type: string; v: string }) => ({
      time: p.t,
      type: p.type as "H" | "L",
      valueFt: parseFloat(p.v),
    }));
  } catch (err) {
    captureError("noaa.getTidePredictionsToday", err);
    return null;
  }
}
