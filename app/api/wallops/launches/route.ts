import { NextRequest, NextResponse } from "next/server";
import { getLaunchViewInfo } from "@/lib/wallops";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(`wallops:${getClientIp(request)}`, 20)) {
    return NextResponse.json({ error: "Too many requests. Try again in a moment." }, { status: 429 });
  }
  const viewInfo = await getLaunchViewInfo();
  return NextResponse.json(viewInfo);
}
