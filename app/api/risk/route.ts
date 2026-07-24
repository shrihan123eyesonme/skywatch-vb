import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode";
import { getFloodGaugeStatus } from "@/lib/noaa";
import { getActiveAlerts, getForecast } from "@/lib/nws";
import { assessRisk } from "@/lib/risk";
import { nearestNeighborhood } from "@/data/neighborhoods";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(`risk:${getClientIp(request)}`, 20)) {
    return NextResponse.json({ error: "Too many requests. Try again in a moment." }, { status: 429 });
  }

  const address = request.nextUrl.searchParams.get("address");
  const latParam = request.nextUrl.searchParams.get("lat");
  const lngParam = request.nextUrl.searchParams.get("lng");

  let lat: number;
  let lng: number;
  let displayName: string | null = null;

  if (latParam && lngParam && !isNaN(parseFloat(latParam)) && !isNaN(parseFloat(lngParam))) {
    lat = parseFloat(latParam);
    lng = parseFloat(lngParam);
  } else if (address) {
    const query = address.toLowerCase().includes("virginia beach")
      ? address
      : `${address}, Virginia Beach, VA`;
    const geocoded = await geocodeAddress(query);
    if (!geocoded) {
      return NextResponse.json(
        { error: "We couldn't find that address. Try a nearby cross street or neighborhood name." },
        { status: 404 }
      );
    }
    lat = geocoded.lat;
    lng = geocoded.lng;
    displayName = geocoded.displayName;
  } else {
    return NextResponse.json(
      { error: "Provide an address, or lat/lng coordinates." },
      { status: 400 }
    );
  }

  const neighborhood = nearestNeighborhood(lat, lng);
  const [gauge, activeAlerts, forecast] = await Promise.all([
    getFloodGaugeStatus(),
    getActiveAlerts(lat, lng),
    getForecast(lat, lng),
  ]);

  const assessment = assessRisk({ neighborhood, gauge, activeAlerts, forecast });

  return NextResponse.json({ ...assessment, lat, lng, displayName });
}
