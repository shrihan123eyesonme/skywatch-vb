"use client";

import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/Button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <svg viewBox="0 0 120 60" className="w-40 text-coral-500" aria-hidden>
        <path
          d="M4 40c8-10 14-10 22 0s14 10 22 0 14-10 22 0 14 10 22 0 14-10 22 0"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <h1 className="mt-8 text-3xl font-bold text-ocean-800 dark:text-sand-50 sm:text-4xl">
        Something went wrong on our end
      </h1>
      <p className="mt-3 max-w-md text-lg text-ocean-700 dark:text-sand-100">
        Not you — us. The error has been logged. You can try again, or head
        back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => unstable_retry()}>Try again</Button>
        <LinkButton href="/" variant="secondary">
          Back to the homepage
        </LinkButton>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-ocean-500 dark:text-sand-300">
          Error reference: {error.digest}
        </p>
      )}
    </div>
  );
}
