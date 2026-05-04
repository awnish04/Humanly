import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function GET() {
  try {
    const clerk = await clerkClient();
    const { data: users } = await clerk.users.getUserList({ limit: 500 });

    const now = new Date();

    // ── User signups per day for last 30 days ─────────────────────────────
    const signupsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      signupsByDay[key] = 0;
    }
    for (const user of users) {
      const day = new Date(user.createdAt).toISOString().slice(0, 10);
      if (day in signupsByDay) signupsByDay[day]++;
    }

    // ── Plan breakdown ────────────────────────────────────────────────────
    const planCounts = { free: 0, basic: 0, pro: 0, max: 0 };
    let totalWordsProcessed = 0;
    let totalRequests = 0;

    for (const user of users) {
      const meta = user.publicMetadata as {
        plan?: string;
        wordsUsed?: number;
        requests?: number;
      };
      const plan = (meta.plan ?? "free") as keyof typeof planCounts;
      if (plan in planCounts) planCounts[plan]++;
      else planCounts.free++;
      totalWordsProcessed += meta.wordsUsed ?? 0;
      totalRequests += meta.requests ?? 0;
    }

    const paidUsers = planCounts.basic + planCounts.pro + planCounts.max;
    const conversionRate =
      users.length > 0 ? ((paidUsers / users.length) * 100).toFixed(1) : "0.0";

    // ── Revenue per day for last 30 days ──────────────────────────────────
    const revenueByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      revenueByDay[d.toISOString().slice(0, 10)] = 0;
    }

    try {
      const startOf30Days = new Date(now);
      startOf30Days.setDate(startOf30Days.getDate() - 30);
      const charges = await stripe.charges.list({
        limit: 100,
        created: { gte: Math.floor(startOf30Days.getTime() / 1000) },
      });
      for (const charge of charges.data) {
        if (!charge.paid || charge.refunded) continue;
        const day = new Date(charge.created * 1000).toISOString().slice(0, 10);
        if (day in revenueByDay) revenueByDay[day] += charge.amount;
      }
    } catch {
      // Stripe unavailable
    }

    // ── Avg words per user ────────────────────────────────────────────────
    const avgWordsPerUser =
      users.length > 0 ? Math.round(totalWordsProcessed / users.length) : 0;

    return NextResponse.json({
      signupsByDay: Object.entries(signupsByDay).map(([date, count]) => ({
        date,
        count,
      })),
      revenueByDay: Object.entries(revenueByDay).map(([date, amount]) => ({
        date,
        amount: amount / 100, // convert cents to dollars
      })),
      planCounts,
      totalUsers: users.length,
      paidUsers,
      conversionRate,
      totalWordsProcessed,
      totalRequests,
      avgWordsPerUser,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
