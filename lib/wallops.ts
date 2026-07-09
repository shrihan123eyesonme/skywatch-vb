import { launchesFallback, wallopsFromVirginiaBeach, LaunchEntry } from "@/data/launches-fallback";
import { getForecast } from "./nws";

export type VisibilityOdds = "good" | "fair" | "poor" | "unknown";

export type LaunchViewInfo = {
  nextLaunch: LaunchEntry | null;
  upcoming: LaunchEntry[];
  live: boolean;
  distanceMiles: number;
  bearingCompass: string;
  visibility: { odds: VisibilityOdds; note: string };
};

const WALLOPS_SCHEDULE_URL = "https://www.nasa.gov/wallops-launch-schedule/";
const USER_AGENT = "SkywatchVB/0.1 (community aerospace hub; contact via github)";

const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&#039;": "'",
  "&apos;": "'",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&hellip;": "…",
  "&ndash;": "–",
  "&mdash;": "—",
  "&quot;": '"',
};

function decodeEntities(text: string): string {
  return text.replace(/&[a-z#0-9]+;/gi, (m) => ENTITY_MAP[m] ?? m);
}

function guessStatus(text: string): LaunchEntry["status"] {
  const t = text.toLowerCase();
  if (t.includes("successful") || t.includes("launched") || t.includes("splashdown") || t.includes("completed")) {
    return "completed";
  }
  if (t.includes("targeting") || t.includes("to support") || t.includes("scheduled") || t.includes("window")) {
    return "scheduled";
  }
  return "tbd";
}

// NASA's Wallops schedule page is a WordPress "content items grid" of blog
// updates, not a clean structured table — this parses that grid. It's
// naturally best-effort against page-markup changes, so any failure to find
// at least one item falls back to the static snapshot rather than showing
// nothing. Cached for 24h via `next.revalidate`, so this effectively
// refreshes daily on its own without a separate scheduled job.
async function fetchLiveLaunchUpdates(): Promise<LaunchEntry[] | null> {
  try {
    const res = await fetch(WALLOPS_SCHEDULE_URL, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const itemPattern =
      /href="(https:\/\/www\.nasa\.gov\/blogs\/wallops\/[^"]+)"\s+class="hds-content-item-heading">\s*<div[^>]*>([^<]+)<\/div>\s*<\/a>[\s\S]{0,400}?<p class="margin-top-0 margin-bottom-1">([^<]+)<\/p>/g;

    const entries: LaunchEntry[] = [];
    let match: RegExpExecArray | null;
    while ((match = itemPattern.exec(html)) !== null && entries.length < 6) {
      const [, url, rawTitle, rawExcerpt] = match;
      const title = decodeEntities(rawTitle.trim());
      const excerpt = decodeEntities(rawExcerpt.trim());
      entries.push({
        missionName: title,
        vehicle: "See NASA Wallops update",
        window: excerpt.replace(/…$/, "").trim(),
        status: guessStatus(`${title} ${excerpt}`),
        sourceUrl: url,
      });
    }

    return entries.length > 0 ? entries : null;
  } catch {
    return null;
  }
}

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
  const [liveUpdates, forecast] = await Promise.all([
    fetchLiveLaunchUpdates(),
    getForecast(36.8529, -75.978),
  ]);

  const upcoming = liveUpdates ?? launchesFallback;
  const nextLaunch =
    upcoming.find((l) => l.status === "scheduled" || l.status === "tbd") ?? upcoming[0] ?? null;

  const tonight = forecast?.find((p) => !p.isDaytime) ?? forecast?.[0] ?? null;
  const visibility = estimateVisibilityFromForecast(tonight?.shortForecast ?? null);

  return {
    nextLaunch,
    upcoming,
    live: liveUpdates !== null,
    distanceMiles: wallopsFromVirginiaBeach.distanceMiles,
    bearingCompass: wallopsFromVirginiaBeach.bearingCompass,
    visibility,
  };
}
