import { launchesFallback, wallopsFromVirginiaBeach } from "@/data/launches-fallback";
import { getForecast } from "./nws";

export type VisibilityOdds = "good" | "fair" | "poor" | "unknown";

export type LaunchViewInfo = {
  nextLaunch: (typeof launchesFallback)[number] | null;
  distanceMiles: number;
  bearingCompass: string;
  visibility: { odds: VisibilityOdds; note: string };
};

function estimateVisibilityFromForecast(shortForecast: string | null): {
  odds: VisibilityOdds;
  note: string;
} {
  if (!shortForecast) {
    return {
      odds: "unknown",
      note: "We couldn't reach the weather forecast just now — check back closer to launch time.",
    };
  }
  const f = shortForecast.toLowerCase();
  if (f.includes("clear") || f.includes("sunny")) {
    return { odds: "good", note: `Tonight's forecast: ${shortForecast}. Clear skies favor visibility toward the north.` };
  }
  if (f.includes("partly") || f.includes("mostly clear") || f.includes("mostly sunny")) {
    return { odds: "fair", note: `Tonight's forecast: ${shortForecast}. Some cloud cover, but you may catch it.` };
  }
  if (f.includes("cloud") || f.includes("overcast") || f.includes("fog")) {
    return { odds: "poor", note: `Tonight's forecast: ${shortForecast}. Cloud cover will likely block the view.` };
  }
  if (f.includes("rain") || f.includes("storm") || f.includes("shower")) {
    return { odds: "poor", note: `Tonight's forecast: ${shortForecast}. Wet weather will likely block the view.` };
  }
  return { odds: "fair", note: `Tonight's forecast: ${shortForecast}.` };
}

export async function getLaunchViewInfo(): Promise<LaunchViewInfo> {
  const nextLaunch =
    launchesFallback.find((l) => l.status === "scheduled" || l.status === "tbd") ??
    launchesFallback[launchesFallback.length - 1] ??
    null;

  const forecast = await getForecast(36.8529, -75.978);
  const tonight = forecast?.find((p) => !p.isDaytime) ?? forecast?.[0] ?? null;
  const visibility = estimateVisibilityFromForecast(tonight?.shortForecast ?? null);

  return {
    nextLaunch,
    distanceMiles: wallopsFromVirginiaBeach.distanceMiles,
    bearingCompass: wallopsFromVirginiaBeach.bearingCompass,
    visibility,
  };
}
