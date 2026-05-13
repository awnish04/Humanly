import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";

/**
 * Cleanup offline users
 * Marks users as offline if they haven't sent a heartbeat in 2 minutes
 * GET /api/admin/cleanup-offline-users
 *
 * This should be called periodically (e.g., via cron job or from admin panel)
 */
export async function GET() {
  try {
    // Calculate 2 minutes ago
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    // Mark users as offline if their last seen time is older than 2 minutes
    const result = await db
      .update(users)
      .set({
        isOnline: false,
        updatedAt: new Date(),
      })
      .where(
        and(eq(users.isOnline, true), lt(users.lastSeenAt, twoMinutesAgo)),
      );

    console.log(`✅ Cleaned up offline users`);

    return NextResponse.json({
      success: true,
      message: "Offline users cleaned up",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Cleanup error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
