import { NextRequest, NextResponse } from "next/server";
import { getFloodGaugeStatus, getTidePredictionsToday } from "@/lib/noaa";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(`noaa:${getClientIp(request)}`, 30)) {
    return NextResponse.json({ error: "Too many requests. Try again in a moment." }, { status: 429 });
  }
  const [gauge, tides] = await Promise.all([
    getFloodGaugeStatus(),
    getTidePredictionsToday(),
  ]);
  return NextResponse.json({ gauge, tides });
}
