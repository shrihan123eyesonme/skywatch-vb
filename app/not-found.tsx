import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <svg viewBox="0 0 120 60" className="w-40 text-ocean-300 dark:text-ocean-500" aria-hidden>
        <path
          d="M4 30c8-6 14-6 22 0s14 6 22 0 14-6 22 0 14 6 22 0 14-6 22 0"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M4 46c8-6 14-6 22 0s14 6 22 0 14-6 22 0 14 6 22 0 14-6 22 0"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <h1 className="mt-8 text-3xl font-bold text-ocean-800 dark:text-sand-50 sm:text-4xl">
        This page drifted out with the tide
      </h1>
      <p className="mt-3 max-w-md text-lg text-ocean-700 dark:text-sand-100">
        We couldn&apos;t find that page. It may have moved, or the link may have
        a typo in it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/">Back to the homepage</LinkButton>
        <LinkButton href="/flood-watch" variant="secondary">
          Check flood risk
        </LinkButton>
      </div>
      <p className="mt-6 text-sm text-ocean-600 dark:text-sand-200">
        Looking for something specific? Try the{" "}
        <Link href="/community" className="font-semibold text-coral-700 hover:underline dark:text-coral-400">
          Community page
        </Link>
        .
      </p>
    </div>
  );
}
