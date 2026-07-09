import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode";
import { getFloodGaugeStatus } from "@/lib/noaa";
import { getActiveAlerts } from "@/lib/nws";
import { assessRisk } from "@/lib/risk";
import { nearestNeighborhood } from "@/data/neighborhoods";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  const latParam = request.nextUrl.searchParams.get("lat");
  const lngParam = request.nextUrl.searchParams.get("lng");

  let lat: number;
  let lng: number;
  let displayName: string | null = null;

  if (latParam && lngParam) {
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
  const [gauge, activeAlerts] = await Promise.all([
    getFloodGaugeStatus(),
    getActiveAlerts(lat, lng),
  ]);

  const assessment = assessRisk({ neighborhood, gauge, activeAlerts });

  return NextResponse.json({ ...assessment, lat, lng, displayName });
}
