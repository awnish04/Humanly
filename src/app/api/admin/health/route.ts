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

  // Check RewriteAI (humanizer)
  const humanizerStart = Date.now();
  try {
    const apiKey = process.env.REWRITE_API_KEY?.replace(/^["']|["']$/g, "");
    const res = await fetch("https://rewriteai.com/api/v1/humanize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text: "ping" }),
      signal: AbortSignal.timeout(5000),
    });
    // Any response (even 402) means the service is reachable
    results.humanizer = {
      status: res.status < 500 ? "ok" : "error",
      latency: Date.now() - humanizerStart,
    };
  } catch {
    results.humanizer = {
      status: "error",
      latency: Date.now() - humanizerStart,
    };
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
