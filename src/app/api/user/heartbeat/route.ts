import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * User heartbeat endpoint
 * Called periodically to update user's online status
 * POST /api/user/heartbeat
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    console.log("❌ Heartbeat: No userId");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!existingUser || existingUser.deleted) {
      console.log(`⚠️ Heartbeat: User ${userId} not found or deleted`);
      return NextResponse.json({ success: true });
    }

    const now = new Date();
    console.log(`Heartbeat: Setting ${userId} ONLINE at ${now.toISOString()}`);
    console.log(
      `   Before: isOnline=${existingUser.isOnline}, lastSeenAt=${existingUser.lastSeenAt?.toISOString()}`,
    );

    await db
      .update(users)
      .set({ isOnline: true, lastSeenAt: now, updatedAt: now })
      .where(eq(users.id, userId));

    // Verify the update
    const [updated] = await db.select().from(users).where(eq(users.id, userId));

    console.log(
      `   After: isOnline=${updated.isOnline}, lastSeenAt=${updated.lastSeenAt?.toISOString()}`,
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Heartbeat error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
