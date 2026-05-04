import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function GET() {
  try {
    const clerk = await clerkClient();

    // Fetch all users from Clerk
    const { data: users } = await clerk.users.getUserList({ limit: 500 });

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const planDistribution = { free: 0, basic: 0, pro: 0, max: 0 };
    let totalWordsProcessed = 0;
    let paidUsers = 0;

    for (const user of users) {
      const meta = user.publicMetadata as { plan?: string; wordsUsed?: number };
      const plan = (meta.plan ?? "free") as keyof typeof planDistribution;
      if (plan in planDistribution) planDistribution[plan]++;
      else planDistribution.free++;
      if (plan !== "free") paidUsers++;
      totalWordsProcessed += meta.wordsUsed ?? 0;
    }

    const createdAtMs = users.map((u) => u.createdAt);
    const signupsToday = createdAtMs.filter(
      (t) => t >= startOfToday.getTime(),
    ).length;
    const signupsWeek = createdAtMs.filter(
      (t) => t >= startOfWeek.getTime(),
    ).length;
    const signupsMonth = createdAtMs.filter(
      (t) => t >= startOfMonth.getTime(),
    ).length;

    // Monthly revenue from Stripe
    let monthlyRevenue = 0;
    try {
      const charges = await stripe.charges.list({
        limit: 100,
        created: { gte: Math.floor(startOfMonth.getTime() / 1000) },
      });
      monthlyRevenue = charges.data
        .filter((c) => c.paid && !c.refunded)
        .reduce((sum, c) => sum + c.amount, 0);
    } catch {
      // Stripe may not have charges yet
    }

    return NextResponse.json({
      totalUsers: users.length,
      paidUsers,
      monthlyRevenue,
      wordsProcessed: totalWordsProcessed,
      planDistribution,
      recentSignups: {
        today: signupsToday,
        week: signupsWeek,
        month: signupsMonth,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
