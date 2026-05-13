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
// heartbeat/route.ts - remove the creation logic entirely
export async function POST() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    // If user doesn't exist or is deleted, don't recreate
    if (!existingUser || existingUser.deleted) {
      return NextResponse.json({ success: true });
    }

    await db
      .update(users)
      .set({ isOnline: true, lastSeenAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
