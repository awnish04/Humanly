/**
 * POST /api/billing/sync
 * Reads the user's active Stripe subscription and syncs plan to Clerk metadata.
 * Called after checkout success so the UI updates immediately without needing a webhook.
 */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const PLAN_WORDS: Record<string, number> = {
  basic: 7000,
  pro: 30000,
  max: 100000,
};

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  try {
    // Find Stripe customer
    let customerId: string | null = null;

    const byMeta = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
      limit: 1,
    });
    if (byMeta.data.length > 0) {
      customerId = byMeta.data[0].id;
    } else if (email) {
      const byEmail = await stripe.customers.list({ email, limit: 1 });
      if (byEmail.data.length > 0) customerId = byEmail.data[0].id;
    }

    if (!customerId) {
      return NextResponse.json({ plan: "free", synced: false });
    }

    // Get active subscription
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subs.data.length === 0) {
      return NextResponse.json({ plan: "free", synced: false });
    }

    const sub = subs.data[0];
    const price = await stripe.prices.retrieve(sub.items.data[0].price.id);
    const product = await stripe.products.retrieve(price.product as string);

    const planId = product.metadata?.plan_id ?? "free";
    const billing = price.recurring?.interval === "year" ? "yearly" : "monthly";
    const wordsLimit = PLAN_WORDS[planId] ?? 500;

    // Update Clerk metadata
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const existing = clerkUser.publicMetadata as Record<string, unknown>;

    // Only reset usage if plan actually changed
    const prevPlan = existing.plan as string | undefined;
    const isUpgrade = prevPlan !== planId;

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...existing,
        plan: planId,
        billing,
        wordsLimit,
        ...(isUpgrade && {
          wordsUsed: 0,
          requests: 0,
          usageResetAt: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
          ).toISOString(),
        }),
      },
    });

    return NextResponse.json({
      plan: planId,
      billing,
      wordsLimit,
      synced: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync error";
    console.error("Billing sync error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
