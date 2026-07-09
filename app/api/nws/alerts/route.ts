import { NextRequest, NextResponse } from "next/server";
import { getActiveAlerts } from "@/lib/nws";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(`nws:${getClientIp(request)}`, 30)) {
    return NextResponse.json({ error: "Too many requests. Try again in a moment." }, { status: 429 });
  }
  const latParam = parseFloat(request.nextUrl.searchParams.get("lat") ?? "36.8529");
  const lngParam = parseFloat(request.nextUrl.searchParams.get("lng") ?? "-75.978");
  const lat = isNaN(latParam) ? 36.8529 : latParam;
  const lng = isNaN(lngParam) ? -75.978 : lngParam;
  const alerts = await getActiveAlerts(lat, lng);
  return NextResponse.json({ alerts });
}
