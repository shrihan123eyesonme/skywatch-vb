"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { FloodReportForm } from "./FloodReportForm";

type Report = {
  id: string;
  description: string;
  reported_at: string;
};

export function FloodReportsPanel() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured());

  async function loadReports() {
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("flood_reports")
      .select("id, description, reported_at")
      .order("reported_at", { ascending: false })
      .limit(10);
    setReports(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const { data } = await supabase!
        .from("flood_reports")
        .select("id, description, reported_at")
        .order("reported_at", { ascending: false })
        .limit(10);
      setReports(data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FloodReportForm onReported={loadReports} />
      <div>
        <p className="text-sm font-semibold text-ocean-700 dark:text-sand-100">
          Recent community reports
        </p>
        <div className="mt-2 space-y-2">
          {loading ? (
            <p className="text-sm text-ocean-600 dark:text-sand-200">Loading…</p>
          ) : reports.length === 0 ? (
            <p className="text-sm text-ocean-600 dark:text-sand-200">
              No reports yet — if you&apos;re seeing flooding, be the first.
            </p>
          ) : (
            reports.map((r) => (
              <Card key={r.id}>
                <p className="text-sm text-ocean-700 dark:text-sand-100">{r.description}</p>
                <p className="mt-1 text-xs text-ocean-500 dark:text-sand-300">
                  {new Date(r.reported_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
