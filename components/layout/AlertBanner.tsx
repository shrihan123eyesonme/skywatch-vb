import Link from "next/link";
import { getActiveAlerts } from "@/lib/nws";

const NOTABLE_SEVERITIES = new Set(["Severe", "Extreme"]);

export async function AlertBanner() {
  const alerts = await getActiveAlerts(36.8529, -75.978);
  const notable = alerts.filter((a) => NOTABLE_SEVERITIES.has(a.severity));

  if (notable.length === 0) return null;

  const top = notable[0];

  return (
    <div className="bg-risk-severe px-4 py-2.5 text-center text-sm font-medium text-white sm:px-6">
      <span className="font-bold">Active alert:</span> {top.event} for Virginia Beach —{" "}
      <Link href="/flood-watch" className="underline underline-offset-2">
        see details
      </Link>
      {notable.length > 1 && ` (+${notable.length - 1} more)`}
    </div>
  );
}
