import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LaunchViewInfo } from "@/lib/wallops";

const VISIBILITY_LABEL: Record<LaunchViewInfo["visibility"]["odds"], string> = {
  good: "Good odds tonight",
  fair: "Fair odds tonight",
  poor: "Unlikely tonight",
  unknown: "Check back closer to launch",
};

export function LaunchTracker({ info }: { info: LaunchViewInfo }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
          Watch a Launch From Your Backyard
        </p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            info.live
              ? "bg-risk-low-bg text-risk-low"
              : "bg-sand-100 text-ocean-600 dark:bg-ocean-700 dark:text-sand-200"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${info.live ? "bg-risk-low" : "bg-ocean-400"}`} />
          {info.live ? "Live from NASA today" : "Cached snapshot"}
        </span>
      </div>
      {info.nextLaunch ? (
        <>
          <h3 className="mt-2 text-2xl font-bold text-ocean-800 dark:text-sand-50">
            {info.nextLaunch.missionName}
          </h3>
          <p className="mt-1 text-ocean-700 dark:text-sand-100">
            {info.nextLaunch.vehicle} · {info.nextLaunch.window}
          </p>
        </>
      ) : (
        <p className="mt-2 text-ocean-700 dark:text-sand-100">
          No confirmed launches on the books right now — check the official schedule.
        </p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-sand-100 p-4 dark:bg-ocean-700/60">
          <p className="text-xs font-semibold uppercase text-ocean-600 dark:text-ocean-200">Where to look</p>
          <p className="mt-1 font-semibold text-ocean-800 dark:text-sand-50">
            {info.bearingCompass}, about {info.distanceMiles} miles away
          </p>
          <p className="text-sm text-ocean-600 dark:text-sand-200">
            Wallops Island launches are visible from Virginia Beach only for larger
            rockets, and only when the trajectory cooperates — not guaranteed.
          </p>
        </div>
        <div className="rounded-xl bg-sand-100 p-4 dark:bg-ocean-700/60">
          <p className="text-xs font-semibold uppercase text-ocean-600 dark:text-ocean-200">Visibility odds</p>
          <p className="mt-1 font-semibold text-ocean-800 dark:text-sand-50">
            {VISIBILITY_LABEL[info.visibility.odds]}
          </p>
          <p className="text-sm text-ocean-600 dark:text-sand-200">{info.visibility.note}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-ocean-700 dark:text-sand-100">
          Upcoming & recent Wallops missions
        </p>
        <ul className="mt-2 space-y-2">
          {info.upcoming.map((l) => (
            <li key={l.missionName} className="flex flex-wrap items-center gap-2 text-sm">
              <Badge>{l.status}</Badge>
              <a
                href={l.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ocean-800 hover:underline dark:text-sand-50"
              >
                {l.missionName}
              </a>
              <span className="text-ocean-600 dark:text-ocean-200">— {l.window}</span>
            </li>
          ))}
        </ul>
        <a
          href="https://www.nasa.gov/wallops-launch-schedule/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-coral-700 dark:text-coral-400 hover:underline"
        >
          See the official NASA Wallops launch schedule →
        </a>
        <p className="mt-2 text-xs text-ocean-600 dark:text-sand-300">
          {info.live
            ? "Pulled live from NASA's own schedule page and refreshed daily."
            : "NASA's page didn't load just now, so this is our last-saved snapshot — always double-check the link above."}
        </p>
      </div>
    </Card>
  );
}
