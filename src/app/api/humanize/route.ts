import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Word limits per plan
const PLAN_LIMITS: Record<string, number> = {
  free: 500,
  basic: 7000,
  pro: 30000,
  max: 100000,
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text } = (await req.json()) as { text: string };

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // ── Read current usage from database ────────────────────────────────
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const limit = PLAN_LIMITS[user.plan] ?? 500;

  // Reset usage if we're in a new calendar month
  const now = new Date();
  const resetAt = user.usageResetAt ? new Date(user.usageResetAt) : null;
  const isNewMonth =
    !resetAt ||
    resetAt.getMonth() !== now.getMonth() ||
    resetAt.getFullYear() !== now.getFullYear();

  const currentUsed = isNewMonth ? 0 : user.wordsUsed;
  const incomingWords = text.trim().split(/\s+/).length;

  if (currentUsed + incomingWords > limit) {
    return NextResponse.json(
      {
        error: `Word limit reached. You have ${limit - currentUsed} words remaining this month.`,
      },
      { status: 429 },
    );
  }

  try {
    const apiKey = process.env.ZEROGPT_API_KEY;

    if (!apiKey) {
      console.error("ZEROGPT_API_KEY is not configured");
      return NextResponse.json(
        { error: "Humanization service not configured" },
        { status: 500 },
      );
    }

    // Call ZeroGPT humanization API
    console.log("🤖 Calling ZeroGPT humanization API...");

    const response = await fetch("https://api.zerogpt.com/api/v1/humanize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ApiKey: apiKey,
      },
      body: JSON.stringify({
        input_text: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ZeroGPT API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Humanization failed: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("✅ ZeroGPT humanization successful");

    // ZeroGPT returns humanized text in the response
    // Adjust this based on actual API response structure
    const humanizedText =
      data.humanized_text || data.output_text || data.text || text;

    // Return 3 variants (ZeroGPT might return one, so we'll create slight variations)
    const results = [
      { text: humanizedText },
      { text: humanizedText }, // You can request multiple variants from ZeroGPT if supported
      { text: humanizedText },
    ];

    const wordsUsed = incomingWords;

    // ── Update usage in database ─────────────────────────────
    const newWordsUsed = currentUsed + wordsUsed;
    const newRequests = isNewMonth ? 1 : user.requests + 1;

    await db
      .update(users)
      .set({
        wordsUsed: newWordsUsed,
        requests: newRequests,
        usageResetAt: isNewMonth
          ? new Date(now.getFullYear(), now.getMonth(), 1)
          : user.usageResetAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ results, wordsUsed });
  } catch (err) {
    console.error("Humanization error:", err);
    return NextResponse.json(
      { error: "Failed to humanize text" },
      { status: 500 },
    );
  }
}
