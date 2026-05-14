/**
 * API Route: Get Visitor Statistics
 * GET /api/visitor-stats?days=7
 * Returns analytics data for the admin dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { getVisitorStats } from "@/lib/visitor-tracking-db";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  console.log("📊 [API] Visitor stats endpoint called");

  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7", 10);
    console.log(`📊 [API] Fetching stats for ${days} days`);

    const stats = await getVisitorStats(days);
    console.log("✅ [API] Stats fetched:", {
      totalVisitors: stats.totalVisitors,
      uniqueVisitors: stats.uniqueVisitors,
    });

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ [API] Error in visitor-stats route:", error);

    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error message:", errorMessage);
    console.error("Error stack:", errorStack);

    return NextResponse.json(
      {
        error: "Failed to fetch visitor stats",
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 },
    );
  }
}
