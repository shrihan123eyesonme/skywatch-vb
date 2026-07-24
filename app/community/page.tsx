import { Suspense } from "react";
import Link from "next/link";
import { LaunchTracker } from "@/components/community/LaunchTracker";
import { OpportunityDirectory } from "@/components/community/OpportunityDirectory";
import { CommunityImpact } from "@/components/community/CommunityImpact";
import { VolunteerBoard } from "@/components/community/VolunteerBoard";
import { getLaunchViewInfo } from "@/lib/wallops";
import { opportunities } from "@/data/opportunities";

export const metadata = {
  title: "Community",
  description:
    "What's happening around Virginia Beach: events, jobs, internships, museum days, and a launch you can watch from your backyard.",
};

export default async function CommunityPage() {
  const launchInfo = await getLaunchViewInfo();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
        Community
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-bold text-ocean-800 dark:text-sand-50 sm:text-4xl">
        What&apos;s happening around Virginia Beach
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ocean-700 dark:text-sand-100">
        Events, jobs, internships, and places worth visiting — including a few
        things you won&apos;t find anywhere else, like watching a rocket launch
        from your backyard.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/forum"
          className="rounded-full border border-ocean-200 px-4 py-2 text-sm font-medium text-ocean-700 hover:bg-ocean-50 dark:border-ocean-600 dark:text-sand-100 dark:hover:bg-ocean-600"
        >
          Neighborhood Forum →
        </Link>
        <Link
          href="/events"
          className="rounded-full border border-ocean-200 px-4 py-2 text-sm font-medium text-ocean-700 hover:bg-ocean-50 dark:border-ocean-600 dark:text-sand-100 dark:hover:bg-ocean-600"
        >
          Events Calendar →
        </Link>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <CommunityImpact />
        </Suspense>
      </div>

      <div className="mt-8">
        <LaunchTracker info={launchInfo} />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-ocean-800 dark:text-sand-50">
          Browse everything happening
        </h2>
        <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">
          Search or filter to find what&apos;s relevant to you.
        </p>
        <div className="mt-4">
          <OpportunityDirectory opportunities={opportunities} />
        </div>
      </div>

      <div id="volunteer" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-bold text-ocean-800 dark:text-sand-50">
          Volunteer & mutual aid
        </h2>
        <div className="mt-4">
          <VolunteerBoard />
        </div>
      </div>
    </div>
  );
}
