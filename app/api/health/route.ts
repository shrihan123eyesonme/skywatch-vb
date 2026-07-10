import { NextResponse } from "next/server";
import { getFloodGaugeStatus } from "@/lib/noaa";
import { getActiveAlerts } from "@/lib/nws";
import { geocodeAddress } from "@/lib/geocode";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { isEmailConfigured } from "@/lib/notifications/email";
import { isSmsConfigured } from "@/lib/notifications/sms";

// Point an uptime monitor (UptimeRobot, Better Stack, or the same GitHub
// Actions cron used for alerts) at this to know when a core data source is
// down, rather than finding out from a user. Checks the three external APIs
// this site depends on, plus which optional integrations are connected.
export async function GET() {
  const [gauge, alerts, geocode] = await Promise.all([
    getFloodGaugeStatus(),
    getActiveAlerts(36.8529, -75.978),
    geocodeAddress("Virginia Beach, VA"),
  ]);

  const checks = {
    noaa: gauge !== null,
    nws: Array.isArray(alerts),
    geocode: geocode !== null,
  };

  const integrations = {
    supabase: isSupabaseConfigured(),
    supabaseAdmin: isAdminConfigured(),
    email: isEmailConfigured(),
    sms: isSmsConfigured(),
  };

  const healthy = checks.noaa && checks.nws && checks.geocode;

  return NextResponse.json(
    { healthy, checks, integrations, checkedAt: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  );
}
