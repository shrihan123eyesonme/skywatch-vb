import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { RiskLevel } from "@/lib/risk";

export type RiskResult = {
  level: RiskLevel;
  headline: string;
  explanation: string;
  tips: string[];
  neighborhood: { name: string };
  gauge: {
    observed: { stageFt: number; validTime: string } | null;
  } | null;
  activeAlerts: { event: string; headline: string }[];
  displayName: string | null;
};

export function RiskSummaryCard({ result }: { result: RiskResult }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-ocean-600 dark:text-ocean-200">
            {result.displayName ?? result.neighborhood.name}
          </p>
          <h3 className="text-xl font-bold text-ocean-800 dark:text-sand-50">
            {result.neighborhood.name}
          </h3>
        </div>
        <RiskBadge level={result.level} />
      </div>

      <p className="mt-4 text-lg font-semibold text-ocean-800 dark:text-sand-50">
        {result.headline}
      </p>
      <p className="mt-2 text-ocean-700 dark:text-sand-100">{result.explanation}</p>

      {result.gauge?.observed && (
        <p className="mt-3 text-sm text-ocean-600 dark:text-sand-300">
          Current water level at Sewells Point: {result.gauge.observed.stageFt.toFixed(1)} ft
        </p>
      )}

      {result.activeAlerts.length > 0 && (
        <div className="mt-4 rounded-xl bg-risk-high-bg p-4">
          <p className="font-semibold text-risk-high">Active National Weather Service alerts</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-risk-high">
            {result.activeAlerts.map((a) => (
              <li key={a.headline}>{a.headline}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <p className="font-semibold text-ocean-800 dark:text-sand-50">Safety tips</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ocean-700 dark:text-sand-100">
          {result.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-ocean-600 dark:text-sand-300">
        This is a first-pass local estimate, not an official flood forecast. Always
        follow guidance from the National Weather Service and the City of Virginia
        Beach.
      </p>

      <details className="mt-3 text-sm text-ocean-600 dark:text-sand-200">
        <summary className="cursor-pointer font-medium text-ocean-700 dark:text-sand-100">
          How we calculate this
        </summary>
        <div className="mt-2 space-y-2">
          <p>
            We start with the current reading and forecast from NOAA&apos;s official
            tide gauge at Sewells Point, and where it sits against the National
            Weather Service&apos;s own action/minor/moderate/major flood-stage
            thresholds for that gauge.
          </p>
          <p>
            We add a point if there&apos;s an active NWS flood or coastal-flood watch
            for the area, two points for an active warning, and up to two more
            points based on {result.neighborhood.name}&apos;s known flood
            sensitivity (built from city stormwater project areas and documented
            flood history, not a live model of your specific block).
          </p>
          <p>
            This is a simple, transparent scoring rule we built and haven&apos;t had
            independently reviewed by a hydrologist or emergency manager — treat it
            as a helpful first read, not a forecast.
          </p>
        </div>
      </details>
    </Card>
  );
}
