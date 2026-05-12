/**
 * API Route: Get Click Statistics
 * GET /api/click-stats?days=7
 * Returns click analytics data
 */

import { NextRequest, NextResponse } from "next/server";
import { getClickStats } from "@/lib/visitor-tracking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7", 10);

    const stats = await getClickStats(days);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching click stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch click statistics" },
      { status: 500 },
    );
  }
}
