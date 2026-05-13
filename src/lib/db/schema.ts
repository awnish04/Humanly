import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Users table - synced from Clerk
 * This stores persistent user data even when users log out
 */
export const users = pgTable("users", {
  // Clerk user ID (primary key)
  id: text("id").primaryKey(),

  // User info
  email: text("email").notNull(),
  name: text("name"),
  avatar: text("avatar"),

  // Plan & billing
  plan: text("plan").notNull().default("free"),
  billing: text("billing"), // "monthly" | "yearly" | null
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  // Usage tracking
  wordsUsed: integer("words_used").notNull().default(0),
  wordsLimit: integer("words_limit").notNull().default(500),
  requests: integer("requests").notNull().default(0),
  usageResetAt: timestamp("usage_reset_at"),

  // Online status tracking
  isOnline: boolean("is_online").notNull().default(false),
  lastSeenAt: timestamp("last_seen_at"),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastSignInAt: timestamp("last_sign_in_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  // Status
  banned: boolean("banned").notNull().default(false),
  deleted: boolean("deleted").notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
