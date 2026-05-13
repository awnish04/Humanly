#!/usr/bin/env node

/**
 * Stripe Price Update Script
 *
 * This script creates products and prices in Stripe based on your pricing-data.ts
 *
 * Usage:
 *   node scripts/update-stripe-prices.mjs
 *
 * Make sure you have:
 * 1. Stripe API key in .env.local (STRIPE_SECRET_KEY)
 * 2. stripe and dotenv packages installed (pnpm add stripe dotenv)
 */

import Stripe from "stripe";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Your pricing from pricing-data.ts
const PLANS = [
  {
    id: "basic",
    name: "Humanly Basic",
    description: "7,000 words per month - Basic Humanization Engine",
    monthlyPrice: 999, // $9.99 in cents
    yearlyPrice: 5988, // $59.88 in cents ($4.99/month × 12)
    features: [
      "7,000 words per month",
      "500 words per input",
      "Basic Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "Multiple results",
    ],
  },
  {
    id: "pro",
    name: "Humanly Pro",
    description: "30,000 words per month - Advanced Humanization Engine",
    monthlyPrice: 1999, // $19.99 in cents
    yearlyPrice: 17988, // $179.88 in cents ($14.99/month × 12)
    features: [
      "30,000 words per month",
      "1,500 words per input",
      "Bypass all AI detectors (incl. Turnitin & GPTZero)",
      "Advanced Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "SEO optimized",
      "Advanced Turnitin Bypass Engine",
      "Human-like results",
      "Unlimited grammar checks",
      "Fast mode",
      "Multiple results",
    ],
  },
  {
    id: "max",
    name: "Humanly Max",
    description: "100,000 words per month - Premium Features",
    monthlyPrice: 3999, // $39.99 in cents
    yearlyPrice: 38388, // $383.88 in cents ($31.99/month × 12)
    features: [
      "100,000 words per month",
      "3,000 words per input",
      "Bypass all AI detectors (incl. Turnitin & GPTZero)",
      "Advanced Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "SEO optimized",
      "Advanced Turnitin Bypass Engine",
      "Human-like results",
      "Unlimited grammar checks",
      "Fast mode",
      "Ultra-human writing output",
      "Priority support",
      "Multiple results",
    ],
  },
];

async function createPrices() {
  console.log("🚀 Creating Stripe products and prices...\n");
  console.log(
    "⚠️  Make sure you are in the correct Stripe mode (test/live)!\n",
  );

  const priceIds = {};

  for (const plan of PLANS) {
    console.log(`📦 Creating ${plan.name}...`);

    try {
      // Create product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan_id: plan.id,
          features: plan.features.join("|"),
        },
      });

      console.log(`   ✅ Product created: ${product.id}`);

      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthlyPrice,
        currency: "usd",
        recurring: {
          interval: "month",
        },
        nickname: `${plan.name} - Monthly`,
        metadata: {
          plan_id: plan.id,
          billing_period: "monthly",
        },
      });

      console.log(`   ✅ Monthly price: ${monthlyPrice.id}`);
      priceIds[`${plan.id}_monthly`] = monthlyPrice.id;

      // Create yearly price
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.yearlyPrice,
        currency: "usd",
        recurring: {
          interval: "year",
        },
        nickname: `${plan.name} - Yearly`,
        metadata: {
          plan_id: plan.id,
          billing_period: "yearly",
        },
      });

      console.log(`   ✅ Yearly price: ${yearlyPrice.id}`);
      priceIds[`${plan.id}_yearly`] = yearlyPrice.id;
      console.log("");
    } catch (error) {
      console.error(`   ❌ Error creating ${plan.name}:`, error.message);
      console.log("");
    }
  }

  console.log("✨ All prices created successfully!\n");
  console.log("📋 Copy these to your .env.local:\n");
  console.log(
    "# ============================================================================",
  );
  console.log(
    "# Stripe Price IDs - Updated " + new Date().toISOString().split("T")[0],
  );
  console.log(
    "# ============================================================================",
  );
  console.log(`STRIPE_PRICE_BASIC_MONTHLY=${priceIds.basic_monthly}`);
  console.log(`STRIPE_PRICE_BASIC_YEARLY=${priceIds.basic_yearly}`);
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${priceIds.pro_monthly}`);
  console.log(`STRIPE_PRICE_PRO_YEARLY=${priceIds.pro_yearly}`);
  console.log(`STRIPE_PRICE_MAX_MONTHLY=${priceIds.max_monthly}`);
  console.log(`STRIPE_PRICE_MAX_YEARLY=${priceIds.max_yearly}`);
  console.log("");
  console.log("💡 Next steps:");
  console.log("   1. Copy the price IDs above to your .env.local");
  console.log("   2. Restart your dev server: pnpm dev");
  console.log("   3. Test checkout at http://localhost:3000/pricing");
  console.log("   4. Repeat for LIVE mode when ready for production");
  console.log("");
}

// Check if Stripe key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ Error: STRIPE_SECRET_KEY not found in .env.local");
  console.log("\nMake sure you have a .env.local file with:");
  console.log('STRIPE_SECRET_KEY="sk_test_..."');
  process.exit(1);
}

// Check if using test key
const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith("sk_test_");
console.log(`🔑 Using Stripe ${isTestMode ? "TEST" : "LIVE"} mode\n`);

if (!isTestMode) {
  console.log("⚠️  WARNING: You are using LIVE mode!");
  console.log("   This will create real products and prices.");
  console.log("   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n");
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

createPrices().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
