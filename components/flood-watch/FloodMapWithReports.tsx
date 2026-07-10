"use client";

import { useEffect, useState } from "react";
import { FloodRiskMap } from "@/components/map/FloodRiskMap";
import type { NeighborhoodRisk, FloodReportMarker } from "@/components/map/FloodRiskMapInner";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function FloodMapWithReports({ neighborhoods }: { neighborhoods: NeighborhoodRisk[] }) {
  const [reports, setReports] = useState<FloodReportMarker[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("flood_reports")
      .select("id, lat, lng, description, reported_at")
      .order("reported_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setReports(
          (data ?? []).map((r) => ({
            id: r.id,
            lat: r.lat,
            lng: r.lng,
            description: r.description ?? "",
            reportedAt: r.reported_at,
          }))
        );
      });
  }, []);

  return <FloodRiskMap neighborhoods={neighborhoods} reports={reports} />;
}
