import { Card } from "@/components/ui/Card";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

// alert_subscriptions and saved_addresses are RLS'd to their owner (for
// good reason — they hold addresses and phone numbers), so a sitewide
// count needs the service-role admin client. This component only ever
// returns aggregate numbers to the page, never the underlying rows.
async function getStats() {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const [alerts, addresses, postings] = await Promise.all([
    supabase.from("alert_subscriptions").select("id", { count: "exact", head: true }).eq("active", true),
    supabase.from("saved_addresses").select("neighborhood_id", { count: "exact", head: false }),
    supabase.from("volunteer_postings").select("id", { count: "exact", head: true }),
  ]);

  const neighborhoodsWatched = new Set(
    (addresses.data ?? []).map((a: { neighborhood_id: string | null }) => a.neighborhood_id).filter(Boolean)
  ).size;

  return {
    activeAlerts: alerts.count ?? 0,
    neighborhoodsWatched,
    volunteerPostings: postings.count ?? 0,
  };
}

export async function CommunityImpact() {
  if (!isAdminConfigured()) {
    return <ConnectSupabaseBanner feature="live community impact stats" />;
  }

  const stats = await getStats();
  if (!stats) return null;

  const items = [
    { label: "Homes with active flood alerts", value: stats.activeAlerts },
    { label: "Neighborhoods being watched", value: stats.neighborhoodsWatched },
    { label: "Neighbors helping neighbors", value: stats.volunteerPostings },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <p className="text-4xl font-bold text-ocean-700 dark:text-sand-50">{item.value}</p>
          <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
