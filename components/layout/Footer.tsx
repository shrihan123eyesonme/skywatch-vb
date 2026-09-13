import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

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
        <div className="mt-6 flex items-center gap-3 border-t border-ocean-100 pt-5 dark:border-ocean-600">
          <Logo className="h-6 w-6" />
          <p className="text-sm font-medium text-ocean-700 dark:text-sand-100">
            Designed &amp; built by Shrihan Mishra
            <span className="text-ocean-500 dark:text-sand-300"> — a student in Virginia Beach who thinks his city deserves better flood tools.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
