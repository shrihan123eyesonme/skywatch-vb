import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { getFloodGaugeStatus } from "@/lib/noaa";
import { getActiveAlerts, getForecast } from "@/lib/nws";
import { assessRisk, RiskLevel } from "@/lib/risk";
import { nearestNeighborhood } from "@/data/neighborhoods";
import { sendAlertEmail } from "@/lib/notifications/email";
import { sendAlertSms } from "@/lib/notifications/sms";
import { SITE_URL } from "@/lib/siteConfig";

// Invoked on a schedule (see vercel.json and .github/workflows) to check every
// active alert subscription against current conditions and notify anyone
// whose threshold has been crossed. Protected by CRON_SECRET so it can't be
// used by randoms to spam our email/SMS budget.

const RISK_ORDER: Record<RiskLevel, number> = { low: 0, elevated: 1, high: 2, severe: 3 };
const RENOTIFY_COOLDOWN_HOURS = 12;

type SubscriptionRow = {
  id: string;
  user_id: string;
  channel: "email" | "sms" | "push";
  risk_threshold: RiskLevel;
  active: boolean;
  last_notified_at: string | null;
  last_notified_level: string | null;
  saved_addresses: {
    id: string;
    label: string;
    address_text: string;
    lat: number;
    lng: number;
  } | null;
};

type ProfileRow = { id: string; email: string; phone_number: string | null };

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ skipped: "Supabase admin not configured", checked: 0 });
  }

  const supabase = createAdminClient()!;
  const { data: subscriptions, error } = await supabase
    .from("alert_subscriptions")
    .select(
      `id, user_id, channel, risk_threshold, active, last_notified_at, last_notified_level,
       saved_addresses ( id, label, address_text, lat, lng )`
    )
    .eq("active", true)
    .returns<SubscriptionRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = [...new Set((subscriptions ?? []).map((s) => s.user_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, phone_number")
    .in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"])
    .returns<ProfileRow[]>();

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const [gauge, activeAlerts, forecast] = await Promise.all([
    getFloodGaugeStatus(),
    getActiveAlerts(36.8529, -75.978),
    getForecast(36.8529, -75.978),
  ]);

  let notified = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const sub of subscriptions ?? []) {
    const profile = profileById.get(sub.user_id);
    if (!sub.saved_addresses || !profile) {
      skipped++;
      continue;
    }

    const neighborhood = nearestNeighborhood(sub.saved_addresses.lat, sub.saved_addresses.lng);
    const assessment = assessRisk({ neighborhood, gauge, activeAlerts, forecast });

    const meetsThreshold = RISK_ORDER[assessment.level] >= RISK_ORDER[sub.risk_threshold];
    if (!meetsThreshold) {
      skipped++;
      continue;
    }

    const sameLevelAsLastTime = sub.last_notified_level === assessment.level;
    const hoursSinceLastNotify = sub.last_notified_at
      ? (Date.now() - new Date(sub.last_notified_at).getTime()) / 3_600_000
      : Infinity;
    if (sameLevelAsLastTime && hoursSinceLastNotify < RENOTIFY_COOLDOWN_HOURS) {
      skipped++;
      continue;
    }

    const subject = `Skywatch VB: ${assessment.headline} near ${sub.saved_addresses.label}`;
    const body = `${assessment.headline}\n${assessment.explanation}\n\nAddress: ${sub.saved_addresses.address_text}\n\nDetails: ${SITE_URL}/flood-watch`;

    let result: { sent: boolean; error?: string };
    if (sub.channel === "email") {
      result = await sendAlertEmail({ to: profile.email, subject, html: `<p>${body.replace(/\n/g, "<br/>")}</p>` });
    } else if (sub.channel === "sms") {
      if (!profile.phone_number) {
        skipped++;
        continue;
      }
      result = await sendAlertSms({ to: profile.phone_number, body: `${subject}\n${assessment.explanation}` });
    } else {
      skipped++;
      continue;
    }

    if (result.sent) {
      notified++;
      await supabase
        .from("alert_subscriptions")
        .update({ last_notified_at: new Date().toISOString(), last_notified_level: assessment.level })
        .eq("id", sub.id);
    } else {
      errors.push(`${sub.id} (${sub.channel}): ${result.error}`);
    }
  }

  return NextResponse.json({
    checked: subscriptions?.length ?? 0,
    notified,
    skipped,
    errors,
  });
}
