import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .where(eq(users.deleted, false))
      .orderBy(desc(users.createdAt));

    if (allUsers.length === 0) {
      console.warn("⚠️ No users in DB — may be a sync issue");
    }

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const result = allUsers.map((user) => {
      const isReallyOnline =
        user.isOnline === true &&
        user.lastSeenAt !== null &&
        user.lastSeenAt > twoMinutesAgo;

      return {
        id: user.id,
        name: user.name ?? "Unknown",
        email: user.email,
        avatar: user.avatar ?? "",
        plan: user.plan,
        billing: user.billing,
        wordsUsed: user.wordsUsed,
        wordsLimit: user.wordsLimit,
        requests: user.requests,
        createdAt: user.createdAt.toISOString(),
        lastSignIn: user.lastSignInAt?.toISOString() ?? null,
        isOnline: isReallyOnline,
        lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ users: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
