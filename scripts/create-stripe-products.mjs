/**
 * Creates Stripe products and prices for Humanly.
 * Run: node scripts/create-stripe-products.mjs
 *
 * Reads STRIPE_SECRET_KEY from .env.local automatically.
 * Prints the price IDs to paste into .env.local.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// ── Read .env.local to get the secret key ────────────────────────────────────
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const match = envContent.match(/^STRIPE_SECRET_KEY=(.+)$/m);

if (!match) {
  console.error("❌  STRIPE_SECRET_KEY not found in .env.local");
  process.exit(1);
}

const STRIPE_SECRET_KEY = match[1].trim();

if (!STRIPE_SECRET_KEY.startsWith("sk_")) {
  console.error(
    "❌  STRIPE_SECRET_KEY looks invalid:",
    STRIPE_SECRET_KEY.slice(0, 8) + "...",
  );
  process.exit(1);
}

const isLive = STRIPE_SECRET_KEY.startsWith("sk_live_");
console.log(`\n🔑  Using ${isLive ? "LIVE" : "TEST"} Stripe key\n`);

// ── Stripe API helper ─────────────────────────────────────────────────────────
async function stripe(method, path, body) {
  const params = body
    ? Object.entries(body)
        .flatMap(([k, v]) => {
          if (typeof v === "object") {
            return Object.entries(v).map(
              ([k2, v2]) => `${k}[${k2}]=${encodeURIComponent(v2)}`,
            );
          }
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
  if (!res.ok) {
    throw new Error(`Stripe error: ${data.error?.message}`);
  }
  return data;
}

// ── Plan definitions ──────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "starter",
    name: "Humanly Starter",
    description: "Best for occasional writers",
    monthly: 900, // $9.00
    yearly: 700, // $7.00/mo billed yearly = $84/yr
  },
  {
    id: "pro",
    name: "Humanly Pro",
    description: "Best for regular content creators",
    monthly: 1900, // $19.00
    yearly: 1500, // $15.00/mo billed yearly = $180/yr
  },
  {
    id: "business",
    name: "Humanly Business",
    description: "Best for teams & high volume",
    monthly: 4900, // $49.00
    yearly: 3900, // $39.00/mo billed yearly = $468/yr
  },
];

// ── Create products and prices ────────────────────────────────────────────────
const results = {};

for (const plan of PLANS) {
  process.stdout.write(`Creating ${plan.name}... `);

  // Create product
  const product = await stripe("POST", "/products", {
    name: plan.name,
    description: plan.description,
    metadata: { plan_id: plan.id },
  });

  // Monthly price
  const monthlyPrice = await stripe("POST", "/prices", {
    product: product.id,
    unit_amount: plan.monthly,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: `${plan.name} Monthly`,
    metadata: { plan_id: plan.id, billing: "monthly" },
  });

  // Yearly price (billed as one annual charge = monthly_rate * 12)
  const yearlyPrice = await stripe("POST", "/prices", {
    product: product.id,
    unit_amount: plan.yearly * 12,
    currency: "usd",
    recurring: { interval: "year" },
    nickname: `${plan.name} Yearly`,
    metadata: { plan_id: plan.id, billing: "yearly" },
  });

  results[plan.id] = {
    monthly: monthlyPrice.id,
    yearly: yearlyPrice.id,
  };

  console.log(`✓  product=${product.id}`);
  console.log(`   monthly=${monthlyPrice.id}  ($${plan.monthly / 100}/mo)`);
  console.log(
    `   yearly=${yearlyPrice.id}   ($${(plan.yearly * 12) / 100}/yr)\n`,
  );
}

// ── Print env vars ────────────────────────────────────────────────────────────
console.log("─".repeat(60));
console.log("✅  Add these to your .env.local:\n");

const envLines = [
  `STRIPE_PRICE_STARTER_MONTHLY=${results.starter.monthly}`,
  `STRIPE_PRICE_STARTER_YEARLY=${results.starter.yearly}`,
  `STRIPE_PRICE_PRO_MONTHLY=${results.pro.monthly}`,
  `STRIPE_PRICE_PRO_YEARLY=${results.pro.yearly}`,
  `STRIPE_PRICE_BUSINESS_MONTHLY=${results.business.monthly}`,
  `STRIPE_PRICE_BUSINESS_YEARLY=${results.business.yearly}`,
];

envLines.forEach((l) => console.log(l));

// ── Auto-update .env.local ────────────────────────────────────────────────────
let updated = envContent;
for (const line of envLines) {
  const [key] = line.split("=");
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(updated)) {
    updated = updated.replace(regex, line);
  } else {
    updated += `\n${line}`;
  }
}

writeFileSync(envPath, updated);
console.log(
  "\n✅  .env.local updated automatically. Restart your dev server.\n",
);
