import { LaunchTracker } from "@/components/aerospace/LaunchTracker";
import { OpportunityDirectory } from "@/components/aerospace/OpportunityDirectory";
import { getLaunchViewInfo } from "@/lib/wallops";
import { opportunities } from "@/data/opportunities";

export const metadata = {
  title: "Aerospace & Opportunity Hub — Skywatch VB",
};

export default async function AerospacePage() {
  const launchInfo = await getLaunchViewInfo();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean-500">
        Aerospace & Opportunity Hub
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-bold text-ocean-800 dark:text-sand-50 sm:text-4xl">
        Real aerospace, right in your backyard
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ocean-700 dark:text-sand-100">
        NASA Langley, NASA Wallops, NAS Oceana, the Military Aviation Museum, and real
        local internships and jobs — in plain language, not jargon.
      </p>

      <div className="mt-8">
        <LaunchTracker info={launchInfo} />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-ocean-800 dark:text-sand-50">
          Find your opportunity
        </h2>
        <div className="mt-4">
          <OpportunityDirectory opportunities={opportunities} />
        </div>
      </div>
    </div>
  );
}
