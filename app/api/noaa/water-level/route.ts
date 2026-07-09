import { NextResponse } from "next/server";
import { getFloodGaugeStatus, getTidePredictionsToday } from "@/lib/noaa";

export async function GET() {
  const [gauge, tides] = await Promise.all([
    getFloodGaugeStatus(),
    getTidePredictionsToday(),
  ]);
  return NextResponse.json({ gauge, tides });
}
