import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const PLAN_WORDS: Record<string, number> = {
  basic: 7000,
  pro: 30000,
  max: 100000,
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  try {
    // Find Stripe customer by userId metadata or email
    let customerId: string | null = null;

    const customersByMeta = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
      limit: 1,
    });

    if (customersByMeta.data.length > 0) {
      customerId = customersByMeta.data[0].id;
    } else if (email) {
      const customersByEmail = await stripe.customers.list({ email, limit: 1 });
      if (customersByEmail.data.length > 0) {
        customerId = customersByEmail.data[0].id;
      }
    }

    if (!customerId) {
      return NextResponse.json({ plan: "free", wordsUsed: 0, wordsLimit: 500 });
    }

    // Get active subscriptions — no deep expand
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ plan: "free", wordsUsed: 0, wordsLimit: 500 });
    }

    const sub = subscriptions.data[0];
    const item = sub.items.data[0];
    const price = await stripe.prices.retrieve(item.price.id);
    const product = await stripe.products.retrieve(price.product as string);

    const planId = product.metadata?.plan_id ?? "free";
    const billing = price.recurring?.interval === "year" ? "yearly" : "monthly";
    const wordsLimit = PLAN_WORDS[planId] ?? 500;
    const renewsAt = sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null;
    const wordsUsed = parseInt(sub.metadata?.words_used ?? "0", 10);

    // Billing portal session — may fail if portal not configured in Stripe dashboard
    let portalUrl: string | null = null;
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/user-dashboard/settings/billing`,
      });
      portalUrl = portalSession.url;
    } catch {
      // Portal not configured yet — user can still see plan info
    }

    return NextResponse.json({
      plan: planId,
      planName: product.name,
      billing,
      wordsUsed,
      wordsLimit,
      renewsAt,
      portalUrl,
      subscriptionId: sub.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("Billing fetch error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
