import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

/**
 * Debug endpoint to check database contents
 * GET /api/admin/debug-db
 */
export async function GET() {
  try {
    // Get all users including deleted ones
    const allUsers = await db.select().from(users);

    console.log("=== DATABASE DEBUG ===");
    console.log(`Total users in database: ${allUsers.length}`);

    allUsers.forEach((user) => {
      console.log(
        `- ${user.email} (${user.id}) - deleted: ${user.deleted}, online: ${user.isOnline}`,
      );
    });

    return NextResponse.json({
      totalUsers: allUsers.length,
      users: allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        deleted: u.deleted,
        isOnline: u.isOnline,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error("Debug error:", err);
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
