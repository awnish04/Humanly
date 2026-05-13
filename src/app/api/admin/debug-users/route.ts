import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Debug endpoint to check Clerk user status
 * GET /api/admin/debug-users
 */
export async function GET() {
  try {
    const clerk = await clerkClient();

    // Get all users including deleted ones
    const { data: activeUsers } = await clerk.users.getUserList({
      limit: 500,
      orderBy: "-created_at",
    });

    console.log("=== CLERK USER DEBUG ===");
    console.log(`Total active users: ${activeUsers.length}`);

    const userDetails = activeUsers.map((user) => ({
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      name: user.fullName ?? user.firstName,
      createdAt: new Date(user.createdAt).toISOString(),
      lastSignIn: user.lastSignInAt
        ? new Date(user.lastSignInAt).toISOString()
        : null,
      banned: user.banned,
      locked: user.locked,
    }));

    console.log("User details:", JSON.stringify(userDetails, null, 2));

    return NextResponse.json({
      totalUsers: activeUsers.length,
      users: userDetails,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Debug users error:", err);
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
