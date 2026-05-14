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

/**
 * Visitor tracking table
 * Stores all visitor data for analytics
 */
export const visitors = pgTable("visitors", {
  id: text("id").primaryKey(), // Hashed visitor ID
  visitId: text("visit_id").notNull(), // Unique per page visit
  ip: text("ip").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  timezone: text("timezone").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  device: text("device").notNull(),
  os: text("os").notNull(),
  browser: text("browser").notNull(),
  browserVersion: text("browser_version").notNull(),
  userAgent: text("user_agent").notNull(),
  referrer: text("referrer").notNull(),
  page: text("page").notNull(),
  sessionId: text("session_id").notNull(),
  isNewVisitor: boolean("is_new_visitor").notNull().default(true),
  visitCount: integer("visit_count").notNull().default(1),
  timeSpent: integer("time_spent"), // seconds
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

/**
 * Click tracking table
 * Stores all click events for heatmap analytics
 */
export const clicks = pgTable("clicks", {
  id: text("id").primaryKey(),
  visitorId: text("visitor_id").notNull(),
  sessionId: text("session_id").notNull(),
  page: text("page").notNull(),
  elementType: text("element_type").notNull(),
  elementText: text("element_text"),
  elementId: text("element_id"),
  elementClass: text("element_class"),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  device: text("device").notNull(),
  os: text("os").notNull(),
  browser: text("browser").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export type Visitor = typeof visitors.$inferSelect;
export type NewVisitor = typeof visitors.$inferInsert;
export type Click = typeof clicks.$inferSelect;
export type NewClick = typeof clicks.$inferInsert;
