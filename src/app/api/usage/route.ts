import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const PLAN_LIMITS: Record<string, number> = {
  free: 500,
  basic: 7000,
  pro: 30000,
  max: 100000,
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
  max: "Max",
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const meta = clerkUser.publicMetadata as {
    plan?: string;
    wordsUsed?: number;
    usageResetAt?: string;
    requests?: number;
  };

  const plan = meta.plan ?? "free";
  const limit = PLAN_LIMITS[plan] ?? 500;

  // Reset if new month
  const now = new Date();
  const resetAt = meta.usageResetAt ? new Date(meta.usageResetAt) : null;
  const isNewMonth =
    !resetAt ||
    resetAt.getMonth() !== now.getMonth() ||
    resetAt.getFullYear() !== now.getFullYear();

  const wordsUsed = isNewMonth ? 0 : (meta.wordsUsed ?? 0);
  const requests = isNewMonth ? 0 : (meta.requests ?? 0);

  return NextResponse.json({
    plan,
    planLabel: PLAN_LABELS[plan] ?? plan,
    wordsUsed,
    wordsLimit: limit,
    wordsRemaining: Math.max(0, limit - wordsUsed),
    requests,
  });
}
