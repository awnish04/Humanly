import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Mark user as offline
 * POST /api/user/offline
 */
export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(`🔴 Marking user ${userId} as offline`);

    // Mark user as offline
    await db
      .update(users)
      .set({
        isOnline: false,
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    console.log(`✅ User ${userId} marked offline`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Offline update error:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
