import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(`geocode:${getClientIp(request)}`, 20)) {
    return NextResponse.json({ error: "Too many requests. Try again in a moment." }, { status: 429 });
  }

  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 3) {
    return NextResponse.json({ error: "Enter at least 3 characters." }, { status: 400 });
  }

  const query = q.toLowerCase().includes("virginia beach") ? q : `${q}, Virginia Beach, VA`;
  const result = await geocodeAddress(query);

  if (!result) {
    return NextResponse.json(
      { error: "We couldn't find that address. Try a nearby cross street or neighborhood name." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
