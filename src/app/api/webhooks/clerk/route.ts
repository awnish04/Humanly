/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Clerk Webhook Handler
 * Syncs user data from Clerk to our database
 *
 * Events handled:
 * - user.created: Create user in database
 * - user.updated: Update user in database
 * - user.deleted: Mark user as deleted (soft delete)
 * - session.created: Update last sign in time
 */

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.error("❌ CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  // Get headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook signature
  const wh = new Webhook(webhookSecret);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as {
      type: string;
      data: any;
    };
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = evt.type;
  console.log(`🔔 WEBHOOK EVENT: ${eventType}`);
  console.log(`🔔 WEBHOOK DATA:`, JSON.stringify(evt.data, null, 2));
  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } =
          evt.data;
        const email = email_addresses?.[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        await db.insert(users).values({
          id,
          email,
          name,
          avatar: image_url,
          plan: "free",
          wordsLimit: 500,
          wordsUsed: 0,
          requests: 0,
          createdAt: new Date(),
          lastSignInAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`✅ User created in database: ${email}`);
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } =
          evt.data;
        const email = email_addresses?.[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        await db
          .update(users)
          .set({
            email,
            name,
            avatar: image_url,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id));

        console.log(`✅ User updated in database: ${email}`);
        break;
      }

      case "user.deleted": {
        const { id, deleted } = evt.data;

        // Only soft delete if Clerk explicitly confirms deletion
        // deleted=true means actually deleted from Clerk, not just logged out
        if (!deleted) {
          console.log(
            `⚠️ Ignoring user.deleted for ${id} — not actually deleted`,
          );
          break;
        }

        await db
          .update(users)
          .set({ deleted: true, updatedAt: new Date() })
          .where(eq(users.id, id));

        console.log(`✅ User actually deleted: ${id}`);
        break;
      }

      case "session.created": {
        const { user_id } = evt.data;

        // Update last sign in time and mark as online
        await db
          .update(users)
          .set({
            lastSignInAt: new Date(),
            isOnline: true,
            lastSeenAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, user_id));

        console.log(`✅ User sign-in recorded: ${user_id}`);
        break;
      }

      case "session.ended":
      case "session.removed":
      case "session.revoked": {
        const { user_id } = evt.data;

        // Mark user as offline when session ends
        await db
          .update(users)
          .set({
            isOnline: false,
            lastSeenAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, user_id));

        console.log(`✅ User marked offline: ${user_id}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`, evt.data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`❌ Error processing webhook ${eventType}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
