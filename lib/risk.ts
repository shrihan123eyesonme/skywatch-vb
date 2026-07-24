import { FloodCategory, FloodGaugeStatus } from "./noaa";
import { NwsAlert, NwsForecastPeriod, isFloodRelevantAlert } from "./nws";
import { Neighborhood } from "@/data/neighborhoods";

export type RiskLevel = "low" | "elevated" | "high" | "severe";

export type RiskAssessment = {
  level: RiskLevel;
  headline: string;
  explanation: string;
  tips: string[];
  neighborhood: Neighborhood;
  gauge: FloodGaugeStatus | null;
  activeAlerts: NwsAlert[];
  rainSignal: { chance: number | null; note: string | null };
};

const CATEGORY_SCORE: Record<FloodCategory, number> = {
  no_flooding: 0,
  action: 1,
  minor: 2,
  moderate: 3,
  major: 4,
  unknown: 0,
};

const LEVEL_COPY: Record<RiskLevel, { headline: string; explanation: string; tips: string[] }> = {
  low: {
    headline: "No unusual flood risk right now",
    explanation:
      "Tide and weather conditions near your area look normal for this time of year. Regular coastal storm-prep habits still apply.",
    tips: [
      "Know your evacuation zone at vaemergency.gov in case a storm changes things fast.",
      "Keep storm drains near your home clear of leaves and debris.",
    ],
  },
  elevated: {
    headline: "Water levels are a bit above normal",
    explanation:
      "The tide gauge or forecast is running higher than usual for your area. This is often just a nuisance — some low spots and streets may get wet — but it's worth keeping an eye on.",
    tips: [
      "Avoid parking on low-lying streets or near storm drains today.",
      "Check tide times before an evening walk on the boardwalk or near tidal creeks.",
      "Move anything valuable out of a flood-prone garage or crawl space, just in case.",
    ],
  },
  high: {
    headline: "Meaningful flooding is likely near you",
    explanation:
      "Water levels are approaching or at NOAA's moderate flood stage for Hampton Roads, and/or there's an active flood watch or warning. Expect some roads to flood, especially at high tide.",
    tips: [
      "Avoid driving through standing water — 6 inches of moving water can move a car.",
      "Charge your phone and keep a flashlight handy in case of power flickers.",
      "Check on elderly or disabled neighbors who may need help moving a car or belongings.",
      "Review your evacuation zone now, before conditions get worse: vaemergency.gov",
    ],
  },
  severe: {
    headline: "Major flooding conditions — take this seriously",
    explanation:
      "Water levels are at or above NOAA's major flood stage for this area, and/or the National Weather Service has an active warning out. This is the kind of event that has historically caused real property damage in Hampton Roads.",
    tips: [
      "Follow official guidance from the City of Virginia Beach and VDEM — evacuate if told to.",
      "Do not walk or drive through flood water.",
      "Move cars to higher ground now if you're in a low-lying area.",
      "Check City of Virginia Beach alerts: alert.vbgov.com",
    ],
  },
};

function assessRainSignal(forecast: NwsForecastPeriod[] | null | undefined): {
  boost: number;
  chance: number | null;
  note: string | null;
} {
  if (!forecast || forecast.length === 0) {
    return { boost: 0, chance: null, note: null };
  }

  // Look at the next couple of forecast periods (roughly the next 24h) —
  // heavy near-term rain drives street-level (pluvial) flooding independent
  // of the tide gauge, which is what the rest of this heuristic is built on.
  const upcoming = forecast.slice(0, 2);
  const worst = upcoming.reduce(
    (max, p) => Math.max(max, p.precipitationChance ?? 0),
    0
  );
  const heavyLanguage = upcoming.some((p) =>
    /thunderstorm|heavy rain|downpour/i.test(p.shortForecast)
  );

  let boost = 0;
  if (worst >= 70 || (heavyLanguage && worst >= 40)) boost = 2;
  else if (worst >= 40) boost = 1;

  const relevant = upcoming.find((p) => (p.precipitationChance ?? 0) === worst) ?? upcoming[0];
  const note =
    worst > 0
      ? `${relevant.name}: ${relevant.shortForecast} (${worst}% chance of rain)`
      : null;

  return { boost, chance: worst || null, note };
}

export function assessRisk(params: {
  neighborhood: Neighborhood;
  gauge: FloodGaugeStatus | null;
  activeAlerts: NwsAlert[];
  forecast?: NwsForecastPeriod[] | null;
}): RiskAssessment {
  const { neighborhood, gauge, activeAlerts, forecast } = params;

  const gaugeCategory: FloodCategory =
    gauge?.forecast?.category ?? gauge?.observed?.category ?? "unknown";
  let score = CATEGORY_SCORE[gaugeCategory] ?? 0;

  const alertBoost = activeAlerts.reduce((max, a) => {
    const kind = isFloodRelevantAlert(a.event);
    if (kind === "warning") return Math.max(max, 2);
    if (kind === "watch") return Math.max(max, 1);
    return max;
  }, 0);
  score += alertBoost;

  const neighborhoodBoost = Math.max(0, Math.min(2, neighborhood.floodSensitivity - 3));
  score += neighborhoodBoost;

  const rain = assessRainSignal(forecast);
  score += rain.boost;

  let level: RiskLevel;
  if (score >= 5) level = "severe";
  else if (score >= 3) level = "high";
  else if (score >= 1) level = "elevated";
  else level = "low";

  const copy = LEVEL_COPY[level];

  const rainClause =
    rain.boost > 0 && rain.note
      ? ` The forecast also shows a real chance of heavy rain (${rain.note}), which can flood streets on its own, separate from the tide.`
      : "";

  return {
    level,
    headline: copy.headline,
    explanation: `${copy.explanation} This estimate factors in ${neighborhood.name}'s known flood sensitivity.${rainClause}`,
    tips: copy.tips,
    neighborhood,
    gauge,
    activeAlerts,
    rainSignal: { chance: rain.chance, note: rain.note },
  };
}
