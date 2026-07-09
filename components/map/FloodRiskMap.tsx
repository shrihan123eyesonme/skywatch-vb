"use client";

import dynamic from "next/dynamic";
import type { NeighborhoodRisk } from "./FloodRiskMapInner";

const FloodRiskMapInner = dynamic(() => import("./FloodRiskMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl bg-ocean-100 text-ocean-600 dark:bg-ocean-700 dark:text-sand-100">
      Loading map…
    </div>
  ),
});

export function FloodRiskMap({ neighborhoods }: { neighborhoods: NeighborhoodRisk[] }) {
  return <FloodRiskMapInner neighborhoods={neighborhoods} />;
}
