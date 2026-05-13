import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Manually sync a user from Clerk to database
 * POST /api/admin/sync-user
 * Body: { userId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // Get user from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json(
        { error: "User not found in Clerk" },
        { status: 404 },
      );
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    const name =
      (clerkUser.fullName ??
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ")) ||
      null;

    const meta = clerkUser.publicMetadata as {
      plan?: string;
      billing?: string;
      wordsUsed?: number;
      wordsLimit?: number;
      requests?: number;
      usageResetAt?: string;
    };

    // Check if user exists in database
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser) {
      // Update existing user
      await db
        .update(users)
        .set({
          email,
          name,
          avatar: clerkUser.imageUrl,
          plan: meta.plan ?? existingUser.plan,
          billing: meta.billing ?? existingUser.billing,
          wordsUsed: meta.wordsUsed ?? existingUser.wordsUsed,
          wordsLimit: meta.wordsLimit ?? existingUser.wordsLimit,
          requests: meta.requests ?? existingUser.requests,
          lastSignInAt: clerkUser.lastSignInAt
            ? new Date(clerkUser.lastSignInAt)
            : existingUser.lastSignInAt,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      console.log(`✅ Updated user in database: ${email}`);
      return NextResponse.json({
        success: true,
        action: "updated",
        user: { id: userId, email },
      });
    } else {
      // Insert new user
      await db.insert(users).values({
        id: userId,
        email: email!,
        name,
        avatar: clerkUser.imageUrl,
        plan: meta.plan ?? "free",
        billing: meta.billing ?? null,
        wordsUsed: meta.wordsUsed ?? 0,
        wordsLimit: meta.wordsLimit ?? 500,
        requests: meta.requests ?? 0,
        usageResetAt: meta.usageResetAt ? new Date(meta.usageResetAt) : null,
        createdAt: new Date(clerkUser.createdAt),
        lastSignInAt: clerkUser.lastSignInAt
          ? new Date(clerkUser.lastSignInAt)
          : null,
        updatedAt: new Date(),
      });

      console.log(`✅ Created user in database: ${email}`);
      return NextResponse.json({
        success: true,
        action: "created",
        user: { id: userId, email },
      });
    }
  } catch (err) {
    console.error("Error syncing user:", err);
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
