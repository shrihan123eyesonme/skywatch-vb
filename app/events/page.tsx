import { EventsCalendar } from "@/components/events/EventsCalendar";

export const metadata = {
  title: "Events Calendar",
  description: "Everything happening around Virginia Beach, added by the community.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
        Events Calendar
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-bold text-ocean-800 dark:text-sand-50 sm:text-4xl">
        What&apos;s on the calendar
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ocean-700 dark:text-sand-100">
        Town halls, meetups, storm-prep sessions, and anything else worth
        knowing about — add your own, or check what your neighbors have
        posted.
      </p>

      <div className="mt-8">
        <EventsCalendar />
      </div>
    </div>
  );
}
