import { NextRequest, NextResponse } from "next/server";
import { getActiveAlerts } from "@/lib/nws";

export async function GET(request: NextRequest) {
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "36.8529");
  const lng = parseFloat(request.nextUrl.searchParams.get("lng") ?? "-75.978");
  const alerts = await getActiveAlerts(lat, lng);
  return NextResponse.json({ alerts });
}
