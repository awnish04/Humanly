/**
 * API Route: Track Time Spent
 * POST /api/track-time
 * Updates time spent on a page for a specific visit
 */

import { NextRequest, NextResponse } from "next/server";
import { updateTimeSpent } from "@/lib/visitor-tracking-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitId, timeSpent } = body;

    if (!visitId || typeof timeSpent !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 },
      );
    }

    await updateTimeSpent(visitId, timeSpent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking time:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track time" },
      { status: 500 },
    );
  }
}
