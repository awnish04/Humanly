import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const PLAN_WORDS: Record<string, number> = {
  basic: 7000,
  pro: 30000,
  max: 100000,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return NextResponse.json(
      { error: "Missing webhook secret or signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Handle subscription created or updated
  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    try {
      let userId: string | null = null;
      let planId: string | null = null;
      let billing: string | null = null;

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        userId = session.metadata?.userId ?? null;
        planId = session.metadata?.planId ?? null;
        billing = session.metadata?.billing ?? null;
      } else {
        const sub = event.data.object as Stripe.Subscription;
        userId = sub.metadata?.userId ?? null;

        // Fetch plan from price/product
        const item = sub.items.data[0];
        const price = await stripe.prices.retrieve(item.price.id);
        const product = await stripe.products.retrieve(price.product as string);
        planId = product.metadata?.plan_id ?? null;
        billing = price.recurring?.interval === "year" ? "yearly" : "monthly";
      }

      if (userId && planId) {
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);
        const existing = clerkUser.publicMetadata as Record<string, unknown>;

        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            ...existing,
            plan: planId,
            billing,
            wordsLimit: PLAN_WORDS[planId] ?? 500,
            // Reset usage on new subscription
            wordsUsed: 0,
            requests: 0,
            usageResetAt: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1,
            ).toISOString(),
          },
        });

        console.log(
          `✅ Updated Clerk metadata for user ${userId}: plan=${planId}`,
        );
      }
    } catch (err) {
      console.error("Failed to update Clerk metadata:", err);
    }
  }

  // Handle subscription cancelled/deleted
  if (event.type === "customer.subscription.deleted") {
    try {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId ?? null;

      if (userId) {
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);
        const existing = clerkUser.publicMetadata as Record<string, unknown>;

        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            ...existing,
            plan: "free",
            billing: null,
            wordsLimit: 500,
            wordsUsed: 0,
            requests: 0,
            usageResetAt: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1,
            ).toISOString(),
          },
        });

        console.log(`✅ Downgraded user ${userId} to free plan`);
      }
    } catch (err) {
      console.error("Failed to downgrade user:", err);
    }
  }

  return NextResponse.json({ received: true });
}
