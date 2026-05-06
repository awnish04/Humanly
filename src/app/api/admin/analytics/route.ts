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

    // ── Build day buckets for last 30 days ────────────────────────────────
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    // ── Signups per day ───────────────────────────────────────────────────
    const signupsByDayMap: Record<string, number> = Object.fromEntries(
      days.map((d) => [d, 0]),
    );
    for (const user of users) {
      const day = new Date(user.createdAt).toISOString().slice(0, 10);
      if (day in signupsByDayMap) signupsByDayMap[day]++;
    }

    // ── Plan breakdown + real usage ───────────────────────────────────────
    const planCounts = { free: 0, basic: 0, pro: 0, max: 0 };
    const wordsByPlan = { free: 0, basic: 0, pro: 0, max: 0 };
    let totalWordsProcessed = 0;
    let totalRequests = 0;

    // Track paid conversions per day (when user's plan was set)
    const conversionsByDay: Record<string, number> = Object.fromEntries(
      days.map((d) => [d, 0]),
    );

    for (const user of users) {
      const meta = user.publicMetadata as {
        plan?: string;
        wordsUsed?: number;
        requests?: number;
        usageResetAt?: string;
      };
      const plan = (meta.plan ?? "free") as keyof typeof planCounts;
      if (plan in planCounts) planCounts[plan]++;
      else planCounts.free++;

      const words = meta.wordsUsed ?? 0;
      const planKey = plan in wordsByPlan ? plan : "free";
      wordsByPlan[planKey] += words;
      totalWordsProcessed += words;
      totalRequests += meta.requests ?? 0;

      // If user has a paid plan, count their signup day as a conversion
      if (plan !== "free") {
        const signupDay = new Date(user.createdAt).toISOString().slice(0, 10);
        if (signupDay in conversionsByDay) conversionsByDay[signupDay]++;
      }
    }

    const paidUsers = planCounts.basic + planCounts.pro + planCounts.max;
    const conversionRate =
      users.length > 0 ? ((paidUsers / users.length) * 100).toFixed(1) : "0.0";

    // ── Revenue per day ───────────────────────────────────────────────────
    const revenueByDayMap: Record<string, number> = Object.fromEntries(
      days.map((d) => [d, 0]),
    );
    try {
      const startOf30Days = new Date(now);
      startOf30Days.setDate(startOf30Days.getDate() - 30);
      const invoices = await stripe.invoices.list({
        limit: 100,
        created: { gte: Math.floor(startOf30Days.getTime() / 1000) },
        status: "paid",
      });
      for (const inv of invoices.data) {
        // Only subscription invoices (Humanly recurring payments)
        const invRecord = inv as unknown as Record<string, unknown>;
        if (!invRecord["subscription"]) continue;
        const day = new Date(inv.created * 1000).toISOString().slice(0, 10);
        if (day in revenueByDayMap)
          revenueByDayMap[day] += inv.amount_paid ?? 0;
      }
    } catch {
      // Stripe unavailable
    }

    // ── Cumulative free vs paid per day ───────────────────────────────────
    // Build running totals: for each day, how many users existed and were paid
    const usersBySignupDay: Record<string, { free: number; paid: number }> = {};
    for (const user of users) {
      const day = new Date(user.createdAt).toISOString().slice(0, 10);
      if (!usersBySignupDay[day]) usersBySignupDay[day] = { free: 0, paid: 0 };
      const meta = user.publicMetadata as { plan?: string };
      if ((meta.plan ?? "free") === "free") usersBySignupDay[day].free++;
      else usersBySignupDay[day].paid++;
    }

    // Running cumulative totals
    let cumulativeFree = 0;
    let cumulativePaid = 0;
    const stackedByDay = days.map((day) => {
      const d = usersBySignupDay[day] ?? { free: 0, paid: 0 };
      cumulativeFree += d.free;
      cumulativePaid += d.paid;
      return { date: day, free: cumulativeFree, paid: cumulativePaid };
    });

    // ── Conversion rate per day (rolling: paid/total at that point) ───────
    const conversionByDay = stackedByDay.map((d) => {
      const total = d.free + d.paid;
      return {
        date: d.date,
        rate: total > 0 ? parseFloat(((d.paid / total) * 100).toFixed(1)) : 0,
      };
    });

    const avgWordsPerUser =
      users.length > 0 ? Math.round(totalWordsProcessed / users.length) : 0;

    return NextResponse.json({
      signupsByDay: days.map((date) => ({
        date,
        count: signupsByDayMap[date],
      })),
      revenueByDay: days.map((date) => ({
        date,
        amount: revenueByDayMap[date] / 100,
      })),
      conversionsByDay: days.map((date) => ({
        date,
        count: conversionsByDay[date],
      })),
      stackedByDay,
      conversionByDay,
      wordsByPlan,
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
