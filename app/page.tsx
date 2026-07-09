import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WaveIcon, CompassIcon } from "@/components/ui/icons";
import { getFloodGaugeStatus } from "@/lib/noaa";
import { getLaunchViewInfo } from "@/lib/wallops";

const CATEGORY_LABEL: Record<string, string> = {
  no_flooding: "Normal",
  action: "Watching closely",
  minor: "Minor flooding",
  moderate: "Moderate flooding",
  major: "Major flooding",
  unknown: "Unavailable",
};

export default async function HomePage() {
  const [gauge, launchInfo] = await Promise.all([
    getFloodGaugeStatus(),
    getLaunchViewInfo(),
  ]);

  const currentCategory = gauge?.observed?.category ?? "unknown";

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-ocean-100 via-sand-50 to-sand-50 dark:from-ocean-700 dark:via-ocean-800 dark:to-ocean-800"
        />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
            For Virginia Beach & Hampton Roads
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-ocean-800 dark:text-sand-50 sm:text-5xl">
            Know your flood risk today. Find your place in the sky tomorrow.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ocean-700 dark:text-sand-100">
            Skywatch VB turns NOAA tide gauges and National Weather Service alerts into
            plain-language answers for your street, and keeps you in the loop on what&apos;s
            happening around the city — not a technical dashboard, a neighborhood resource.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/flood-watch">Check my street&apos;s flood risk</LinkButton>
            <LinkButton href="/community" variant="secondary">
              See what&apos;s happening
            </LinkButton>
          </div>
        </div>
        <svg
          aria-hidden
          viewBox="0 0 1440 80"
          className="block w-full text-sand-50 dark:text-ocean-800"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0 40c120 20 240 20 360 0s240-20 360 0 240 20 360 0 240-20 360 0v40H0V40z"
          />
        </svg>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
              Right now at Sewells Point
            </p>
            <p className="mt-2 text-2xl font-bold text-ocean-800 dark:text-sand-50">
              {CATEGORY_LABEL[currentCategory]}
            </p>
            <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">
              {gauge?.observed
                ? `Water level: ${gauge.observed.stageFt.toFixed(1)} ft`
                : "Live NOAA data is temporarily unavailable."}
            </p>
            <Link href="/flood-watch" className="mt-4 inline-block text-sm font-semibold text-coral-700 dark:text-coral-400 hover:underline">
              See what this means for your neighborhood →
            </Link>
          </Card>
          <Card>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
              Next launch you might see from here
            </p>
            <p className="mt-2 text-2xl font-bold text-ocean-800 dark:text-sand-50">
              {launchInfo.nextLaunch?.missionName ?? "Check the schedule"}
            </p>
            <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">
              Wallops Island is about {launchInfo.distanceMiles} miles{" "}
              {launchInfo.bearingCompass} of Virginia Beach.
            </p>
            <Link href="/community" className="mt-4 inline-block text-sm font-semibold text-coral-700 dark:text-coral-400 hover:underline">
              Watch a launch from your backyard →
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-ocean-800 dark:text-sand-50">
          Two ways we can help
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Card className="flex flex-col">
            <WaveIcon className="h-8 w-8 text-ocean-600 dark:text-ocean-200" />
            <h3 className="mt-3 text-xl font-bold text-ocean-800 dark:text-sand-50">
              Flood & Storm Watch
            </h3>
            <p className="mt-2 flex-1 text-ocean-700 dark:text-sand-100">
              Search your address or pick your neighborhood to get a plain-language
              read on today&apos;s flood risk, built from live NOAA tide data and
              National Weather Service alerts — plus what Virginia Beach neighbors
              have reported flooding in the past.
            </p>
            <LinkButton href="/flood-watch" className="mt-4 self-start">
              Check flood risk
            </LinkButton>
          </Card>
          <Card className="flex flex-col">
            <CompassIcon className="h-8 w-8 text-ocean-600 dark:text-ocean-200" />
            <h3 className="mt-3 text-xl font-bold text-ocean-800 dark:text-sand-50">
              Community
            </h3>
            <p className="mt-2 flex-1 text-ocean-700 dark:text-sand-100">
              Local events, jobs, internships, and places worth visiting — from the
              NAS Oceana Air Show to a rocket launch you can watch from your
              backyard — all searchable in one place.
            </p>
            <LinkButton href="/community" variant="secondary" className="mt-4 self-start">
              See what&apos;s happening
            </LinkButton>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Card className="!bg-ocean-500 !text-sand-50 dark:!bg-ocean-600">
          <h2 className="text-xl font-bold">Get flood alerts before the water rises</h2>
          <p className="mt-2 max-w-xl text-ocean-50">
            Save your address and we&apos;ll let you know when flood risk crosses a
            threshold near you. Free, and you can turn it off anytime.
          </p>
          <LinkButton href="/account" variant="secondary" className="mt-4">
            Set up alerts
          </LinkButton>
        </Card>
      </section>
    </div>
  );
}
