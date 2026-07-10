import { ForumBoard } from "@/components/forum/ForumBoard";

export const metadata = {
  title: "Neighborhood Forum — Skywatch VB",
  description: "Talk to your neighbors about flooding, storm prep, and everything else.",
};

export default function ForumPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
        Neighborhood Forum
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-bold text-ocean-800 dark:text-sand-50 sm:text-4xl">
        Talk to your neighbors
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ocean-700 dark:text-sand-100">
        Flood reports, storm prep tips, or just what&apos;s going on down the
        street — organized by neighborhood.
      </p>

      <div className="mt-8">
        <ForumBoard />
      </div>
    </div>
  );
}
