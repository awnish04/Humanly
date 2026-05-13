import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Sync all Clerk users to database
 * GET /api/admin/sync-all-users
 */
export async function GET() {
  try {
    console.log("🔄 Starting Clerk user sync...");

    // Get all users from Clerk
    const clerk = await clerkClient();
    const { data: clerkUsers } = await clerk.users.getUserList({
      limit: 500,
      orderBy: "-created_at",
    });

    console.log(`📊 Found ${clerkUsers.length} users in Clerk`);

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const clerkUser of clerkUsers) {
      try {
        const email = clerkUser.emailAddresses?.[0]?.emailAddress;
        if (!email) {
          console.log(`⚠️  Skipping user ${clerkUser.id} (no email)`);
          skipped++;
          continue;
        }

        const firstName = clerkUser.firstName || "";
        const lastName = clerkUser.lastName || "";
        const fullName = clerkUser.fullName || "";
        const name =
          fullName || [firstName, lastName].filter(Boolean).join(" ") || null;

        const meta = (clerkUser.publicMetadata || {}) as {
          plan?: string;
          billing?: string;
          wordsUsed?: number;
          wordsLimit?: number;
          requests?: number;
          usageResetAt?: string;
        };

        // Check if user already exists
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, clerkUser.id));

        if (existingUser) {
          console.log(`⏭️  Skipping ${email} (already exists)`);
          skipped++;
          continue;
        }

        // Insert user
        await db.insert(users).values({
          id: clerkUser.id,
          email: email,
          name: name,
          avatar: clerkUser.imageUrl || null,
          plan: meta.plan || "free",
          billing: meta.billing || null,
          wordsUsed: meta.wordsUsed || 0,
          wordsLimit: meta.wordsLimit || 500,
          requests: meta.requests || 0,
          usageResetAt: meta.usageResetAt ? new Date(meta.usageResetAt) : null,
          createdAt: new Date(clerkUser.createdAt),
          lastSignInAt: clerkUser.lastSignInAt
            ? new Date(clerkUser.lastSignInAt)
            : null,
          updatedAt: new Date(),
          banned: false,
          deleted: false,
          isOnline: false,
          lastSeenAt: null,
        });

        console.log(`✅ Synced ${email}`);
        synced++;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Error syncing user ${clerkUser.id}:`, message);
        errors++;
      }
    }

    const summary = {
      total: clerkUsers.length,
      synced,
      skipped,
      errors,
    };

    console.log("📈 Sync Summary:", summary);

    return NextResponse.json({
      success: true,
      message: "Sync complete",
      ...summary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Fatal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
