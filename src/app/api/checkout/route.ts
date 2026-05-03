import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const PRICE_MAP: Record<string, Record<string, string | undefined>> = {
  basic: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    yearly: process.env.STRIPE_PRICE_BASIC_YEARLY,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  max: {
    monthly: process.env.STRIPE_PRICE_MAX_MONTHLY,
    yearly: process.env.STRIPE_PRICE_MAX_YEARLY,
  },
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  const { planId, billing } = (await req.json()) as {
    planId: string;
    billing: string;
  };

  const priceId = PRICE_MAP[planId]?.[billing];

  // Validate that a real Stripe price ID has been configured
  if (!priceId || !priceId.startsWith("price_1")) {
    return NextResponse.json(
      {
        error:
          "Plan not configured yet. Create products in your Stripe Dashboard and add the Price IDs to .env.local",
      },
      { status: 400 },
    );
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  try {
    // Find or create a Stripe customer with userId in metadata
    let customerId: string | undefined;
    const existing = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
      limit: 1,
    });

    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, planId, billing },
      subscription_data: { metadata: { userId, planId, billing } },
      success_url: `${origin}/user-dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
