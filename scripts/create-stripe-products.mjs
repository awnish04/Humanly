/**
 * Creates Stripe products and prices for Humanly.
 * - Idempotent: skips creation if a product with the same plan_id metadata already exists.
 * - Cleanup: archives any products whose plan_id is NOT in the current PLANS list.
 *
 * Run: node scripts/create-stripe-products.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const match = envContent.match(/^STRIPE_SECRET_KEY=(.+)$/m);

if (!match) {
  console.error("❌  STRIPE_SECRET_KEY not found in .env.local");
  process.exit(1);
}

const STRIPE_SECRET_KEY = match[1].trim().replace(/^["']|["']$/g, "");

if (!STRIPE_SECRET_KEY.startsWith("sk_")) {
  console.error(
    "❌  STRIPE_SECRET_KEY looks invalid:",
    STRIPE_SECRET_KEY.slice(0, 8) + "...",
  );
  process.exit(1);
}

const isLive = STRIPE_SECRET_KEY.startsWith("sk_live_");
console.log(`\n🔑  Using ${isLive ? "LIVE" : "TEST"} Stripe key\n`);

// ── Stripe helper ─────────────────────────────────────────────────────────────
async function stripe(method, path, body) {
  const params = body
    ? Object.entries(body)
        .flatMap(([k, v]) => {
          if (typeof v === "object")
            return Object.entries(v).map(
              ([k2, v2]) => `${k}[${k2}]=${encodeURIComponent(v2)}`,
            );
          return [`${k}=${encodeURIComponent(v)}`];
        })
        .join("&")
    : null;

  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Stripe error: ${data.error?.message}`);
  return data;
}

// Fetch all pages of a list endpoint
async function stripeList(path, params = {}) {
  const items = [];
  let hasMore = true;
  let startingAfter = null;

  while (hasMore) {
    const query = new URLSearchParams(params);
    query.set("limit", "100");
    if (startingAfter) query.set("starting_after", startingAfter);

    const data = await stripe("GET", `${path}?${query.toString()}`);
    items.push(...data.data);
    hasMore = data.has_more;
    if (hasMore) startingAfter = data.data[data.data.length - 1].id;
  }

  return items;
}

// ── Plan definitions (match pricing-data.ts) ──────────────────────────────────
const PLANS = [
  {
    id: "basic",
    name: "Humanly Basic",
    description: "7,000 words per month",
    monthly: 1499,
    yearly: 1199,
  },
  {
    id: "pro",
    name: "Humanly Pro",
    description: "30,000 words per month",
    monthly: 4899,
    yearly: 3899,
  },
  {
    id: "max",
    name: "Humanly Max",
    description: "100,000 words per month",
    monthly: 9899,
    yearly: 7899,
  },
];

const validPlanIds = new Set(PLANS.map((p) => p.id));

// ── Step 1: Fetch all existing products ───────────────────────────────────────
console.log("🔍  Fetching existing Stripe products...\n");
const allProducts = await stripeList("/products");

// ── Step 2: Archive products that don't belong to current plans ───────────────
const staleProducts = allProducts.filter(
  (p) => p.active && !validPlanIds.has(p.metadata?.plan_id),
);

if (staleProducts.length > 0) {
  console.log(
    `🗑️   Found ${staleProducts.length} stale product(s) to archive:`,
  );
  for (const p of staleProducts) {
    process.stdout.write(`   Archiving "${p.name}" (${p.id})... `);
    await stripe("POST", `/products/${p.id}`, { active: "false" });
    console.log("✓");
  }
  console.log();
} else {
  console.log("✅  No stale products found.\n");
}

// ── Step 3: Build a map of existing valid products by plan_id ─────────────────
const existingByPlanId = {};
for (const p of allProducts) {
  const pid = p.metadata?.plan_id;
  if (pid && validPlanIds.has(pid) && p.active) {
    existingByPlanId[pid] = p;
  }
}

// ── Step 4: Create or reuse products & prices ─────────────────────────────────
const results = {};

for (const plan of PLANS) {
  const existing = existingByPlanId[plan.id];

  if (existing) {
    process.stdout.write(
      `⏭️   "${plan.name}" already exists (${existing.id}), fetching prices... `,
    );

    // Find the active monthly and yearly prices for this product
    const prices = await stripeList("/prices", {
      product: existing.id,
      active: "true",
    });
    const monthly = prices.find(
      (p) =>
        p.metadata?.billing === "monthly" || p.recurring?.interval === "month",
    );
    const yearly = prices.find(
      (p) =>
        p.metadata?.billing === "yearly" || p.recurring?.interval === "year",
    );

    if (!monthly || !yearly) {
      console.log("⚠️  missing prices, recreating...");
      // Fall through to create prices below by clearing existing
      existingByPlanId[plan.id] = null;
    } else {
      results[plan.id] = { monthly: monthly.id, yearly: yearly.id };
      console.log("✓");
      console.log(`   monthly=${monthly.id}  yearly=${yearly.id}\n`);
      continue;
    }
  }

  process.stdout.write(`Creating "${plan.name}"... `);

  const product = await stripe("POST", "/products", {
    name: plan.name,
    description: plan.description,
    metadata: { plan_id: plan.id },
  });

  const monthlyPrice = await stripe("POST", "/prices", {
    product: product.id,
    unit_amount: plan.monthly,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: `${plan.name} Monthly`,
    metadata: { plan_id: plan.id, billing: "monthly" },
  });

  const yearlyPrice = await stripe("POST", "/prices", {
    product: product.id,
    unit_amount: plan.yearly * 12,
    currency: "usd",
    recurring: { interval: "year" },
    nickname: `${plan.name} Yearly`,
    metadata: { plan_id: plan.id, billing: "yearly" },
  });

  results[plan.id] = { monthly: monthlyPrice.id, yearly: yearlyPrice.id };

  console.log(`✓  product=${product.id}`);
  console.log(`   monthly=${monthlyPrice.id}  (${plan.monthly / 100}/mo)`);
  console.log(
    `   yearly=${yearlyPrice.id}   (${(plan.yearly * 12) / 100}/yr)\n`,
  );
}

// ── Step 5: Write price IDs to .env.local ─────────────────────────────────────
console.log("─".repeat(60));
console.log("✅  Price IDs:\n");

const envLines = [
  `STRIPE_PRICE_BASIC_MONTHLY=${results.basic.monthly}`,
  `STRIPE_PRICE_BASIC_YEARLY=${results.basic.yearly}`,
  `STRIPE_PRICE_PRO_MONTHLY=${results.pro.monthly}`,
  `STRIPE_PRICE_PRO_YEARLY=${results.pro.yearly}`,
  `STRIPE_PRICE_MAX_MONTHLY=${results.max.monthly}`,
  `STRIPE_PRICE_MAX_YEARLY=${results.max.yearly}`,
];

envLines.forEach((l) => console.log(l));

let updated = envContent;
for (const line of envLines) {
  const [key] = line.split("=");
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(updated)) updated = updated.replace(regex, line);
  else updated += `\n${line}`;
}

writeFileSync(envPath, updated);
console.log(
  "\n✅  .env.local updated automatically. Restart your dev server.\n",
);
