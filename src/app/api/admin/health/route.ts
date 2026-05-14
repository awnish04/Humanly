import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const results: Record<string, { status: "ok" | "error"; latency: number }> =
    {};

  // Check Clerk
  const clerkStart = Date.now();
  try {
    const clerk = await clerkClient();
    await clerk.users.getUserList({ limit: 1 });
    results.clerk = { status: "ok", latency: Date.now() - clerkStart };
  } catch {
    results.clerk = { status: "error", latency: Date.now() - clerkStart };
  }

  // Check Stripe
  const stripeStart = Date.now();
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
    });
    await stripe.balance.retrieve();
    results.stripe = { status: "ok", latency: Date.now() - stripeStart };
  } catch {
    results.stripe = { status: "error", latency: Date.now() - stripeStart };
  }

  // Check ZeroGPT API (Humanizer)
  const zerogptStart = Date.now();
  try {
    const apiKey = process.env.ZEROGPT_API_KEY;
    if (!apiKey) {
      results.zerogpt = { status: "error", latency: 0 };
    } else {
      // Test with a small text to check if API is responsive
      const response = await fetch(
        "https://api.zerogpt.com/api/detect/detectText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ApiKey: apiKey,
          },
          body: JSON.stringify({
            input_text: "This is a test.",
          }),
        },
      );

      if (response.ok) {
        results.zerogpt = { status: "ok", latency: Date.now() - zerogptStart };
      } else {
        results.zerogpt = {
          status: "error",
          latency: Date.now() - zerogptStart,
        };
      }
    }
  } catch {
    results.zerogpt = { status: "error", latency: Date.now() - zerogptStart };
  }

  // Database check (Neon PostgreSQL)
  const dbStart = Date.now();
  try {
    // Simple query to check database connectivity
    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    await db.select().from(users).limit(1);
    results.database = { status: "ok", latency: Date.now() - dbStart };
  } catch {
    results.database = { status: "error", latency: Date.now() - dbStart };
  }

  // API itself is always ok if we got here
  results.api = { status: "ok", latency: 0 };

  const allOk = Object.values(results).every((r) => r.status === "ok");

  return NextResponse.json({
    overall: allOk ? "ok" : "degraded",
    services: results,
    checkedAt: new Date().toISOString(),
  });
}
