import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ocean-100 bg-sand-100/60 dark:bg-ocean-700/40 dark:border-ocean-600">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ocean-700 dark:text-sand-200 sm:px-6">
        <p className="max-w-2xl">
          Skywatch VB is a community resource, not an official emergency service. For
          life-threatening emergencies, call 911. For official alerts and evacuation
          guidance, follow the{" "}
          <a href="https://www.vaemergency.gov/" className="underline">
            Virginia Department of Emergency Management
          </a>{" "}
          and{" "}
          <a href="https://www.weather.gov/akq/" className="underline">
            National Weather Service Wakefield
          </a>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <Link href="/privacy" className="underline text-ocean-600 dark:text-sand-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="underline text-ocean-600 dark:text-sand-300">
            Terms of Service
          </Link>
        </div>
        <p className="mt-4 text-xs text-ocean-600 dark:text-sand-300">
          Flood data from NOAA and the National Weather Service. Built for Virginia Beach, VA.
        </p>
      </div>
    </footer>
  );
}
