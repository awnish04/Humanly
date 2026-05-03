import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

  // ── Read current usage from Clerk metadata ────────────────────────────────
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const meta = clerkUser.publicMetadata as {
    plan?: string;
    wordsUsed?: number;
    usageResetAt?: string;
  };

  const plan = meta.plan ?? "free";
  const limit = PLAN_LIMITS[plan] ?? 500;

  // Reset usage if we're in a new calendar month
  const now = new Date();
  const resetAt = meta.usageResetAt ? new Date(meta.usageResetAt) : null;
  const isNewMonth =
    !resetAt ||
    resetAt.getMonth() !== now.getMonth() ||
    resetAt.getFullYear() !== now.getFullYear();

  const currentUsed = isNewMonth ? 0 : (meta.wordsUsed ?? 0);
  const incomingWords = text.trim().split(/\s+/).length;

  if (currentUsed + incomingWords > limit) {
    return NextResponse.json(
      {
        error: `Word limit reached. You have ${limit - currentUsed} words remaining this month.`,
      },
      { status: 429 },
    );
  }

  const apiKey = process.env.REWRITE_API_KEY?.replace(/^["']|["']$/g, "");
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://rewriteai.com/api/v1/humanize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text }),
    });

    const raw = await res.text();

    if (!res.ok) {
      const isQuotaError =
        res.status === 402 || /insufficient|balance|quota|limit/i.test(raw);
      if (isQuotaError) {
        // This is a backend infrastructure issue — don't expose it as user's problem
        console.error(
          "RewriteAI quota exhausted — top up the API key at rewriteai.com",
        );
        return NextResponse.json(
          {
            error:
              "Humanization service is temporarily unavailable. Please try again later or contact support.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: raw || `Error ${res.status}` },
        { status: res.status },
      );
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { results: [{ text: raw }] };
    }

    const results = (data.results as { text: string }[]) ?? [];
    const wordsUsed = (data.wordsUsed as number) ?? incomingWords;

    if (!results.length) {
      return NextResponse.json(
        { error: "No results returned" },
        { status: 500 },
      );
    }

    // ── Persist updated usage to Clerk metadata ─────────────────────────────
    const newWordsUsed = currentUsed + wordsUsed;
    const newRequests = isNewMonth ? 1 : (meta.requests ?? 0) + 1;
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        wordsUsed: newWordsUsed,
        requests: newRequests,
        usageResetAt: isNewMonth
          ? new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
          : meta.usageResetAt,
      },
    });

    return NextResponse.json({ results, wordsUsed });
  } catch (err) {
    console.error("RewriteAI fetch error:", err);
    return NextResponse.json(
      { error: "Failed to reach humanization service" },
      { status: 502 },
    );
  }
}
