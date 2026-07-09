import { NextResponse } from "next/server";
import { getLaunchViewInfo } from "@/lib/wallops";
import { launchesFallback } from "@/data/launches-fallback";

export async function GET() {
  const viewInfo = await getLaunchViewInfo();
  return NextResponse.json({ ...viewInfo, upcoming: launchesFallback });
}
