# Stripe Price Update Guide

## 📊 Your New Pricing

Based on your `pricing-data.ts`:

| Plan      | Monthly Price | Yearly Price                | Yearly Savings |
| --------- | ------------- | --------------------------- | -------------- |
| **Basic** | $9.99/month   | $4.99/month ($59.88/year)   | 50% off        |
| **Pro**   | $19.99/month  | $14.99/month ($179.88/year) | 25% off        |
| **Max**   | $39.99/month  | $31.99/month ($383.88/year) | 20% off        |

---

## 🎯 Two Options to Update Stripe Prices

### Option 1: Manual Update via Stripe Dashboard (Recommended)

### Option 2: Automated Script (Faster)

---

## Option 1: Manual Update via Stripe Dashboard

### Step 1: Login to Stripe

1. Go to https://dashboard.stripe.com/
2. Login with your account
3. **Important:** Make sure you're in **TEST mode** first!

### Step 2: Create Products & Prices

#### A. Basic Plan

**Monthly Price:**

1. Go to **Products** → **Add Product**
2. Fill in:
   - **Name:** `Humanly Basic - Monthly`
   - **Description:** `7,000 words per month`
   - **Pricing:** `$9.99 USD`
   - **Billing period:** `Monthly`
   - **Recurring:** Yes
3. Click **Save product**
4. **Copy the Price ID** (starts with `price_...`)
5. Save it as: `STRIPE_PRICE_BASIC_MONTHLY`

**Yearly Price:**

1. Go to **Products** → **Add Product**
2. Fill in:
   - **Name:** `Humanly Basic - Yearly`
   - **Description:** `7,000 words per month (billed annually)`
   - **Pricing:** `$59.88 USD` (that's $4.99/month × 12)
   - **Billing period:** `Yearly`
   - **Recurring:** Yes
3. Click **Save product**
4. **Copy the Price ID**
5. Save it as: `STRIPE_PRICE_BASIC_YEARLY`

#### B. Pro Plan

**Monthly Price:**

1. **Name:** `Humanly Pro - Monthly`
2. **Description:** `30,000 words per month`
3. **Pricing:** `$19.99 USD`
4. **Billing period:** `Monthly`
5. Copy Price ID → `STRIPE_PRICE_PRO_MONTHLY`

**Yearly Price:**

1. **Name:** `Humanly Pro - Yearly`
2. **Description:** `30,000 words per month (billed annually)`
3. **Pricing:** `$179.88 USD` (that's $14.99/month × 12)
4. **Billing period:** `Yearly`
5. Copy Price ID → `STRIPE_PRICE_PRO_YEARLY`

#### C. Max Plan

**Monthly Price:**

1. **Name:** `Humanly Max - Monthly`
2. **Description:** `100,000 words per month`
3. **Pricing:** `$39.99 USD`
4. **Billing period:** `Monthly`
5. Copy Price ID → `STRIPE_PRICE_MAX_MONTHLY`

**Yearly Price:**

1. **Name:** `Humanly Max - Yearly`
2. **Description:** `100,000 words per month (billed annually)`
3. **Pricing:** `$383.88 USD` (that's $31.99/month × 12)
4. **Billing period:** `Yearly`
5. Copy Price ID → `STRIPE_PRICE_MAX_YEARLY`

### Step 3: Update .env.local

Replace the old price IDs with your new ones:

```env
# Stripe Price IDs - TEST MODE
STRIPE_PRICE_BASIC_MONTHLY=price_YOUR_NEW_ID_HERE
STRIPE_PRICE_BASIC_YEARLY=price_YOUR_NEW_ID_HERE
STRIPE_PRICE_PRO_MONTHLY=price_YOUR_NEW_ID_HERE
STRIPE_PRICE_PRO_YEARLY=price_YOUR_NEW_ID_HERE
STRIPE_PRICE_MAX_MONTHLY=price_YOUR_NEW_ID_HERE
STRIPE_PRICE_MAX_YEARLY=price_YOUR_NEW_ID_HERE
```

### Step 4: Test in Development

```bash
# Restart your dev server
pnpm dev

# Go to http://localhost:3000/pricing
# Click "Get Started" on any plan
# Verify the correct price shows in Stripe checkout
```

### Step 5: Create LIVE Prices

Once testing is complete:

1. Switch to **LIVE mode** in Stripe dashboard
2. Repeat Steps 2-3 above
3. Add LIVE price IDs to **Vercel Environment Variables**:
   - Go to Vercel dashboard
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add the LIVE price IDs
   - Redeploy your site

---

## Option 2: Automated Script (Faster)

I'll create a script that automatically creates all prices in Stripe.

### Step 1: Create the Script

Create file: `scripts/update-stripe-prices.mjs`

```javascript
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = [
  {
    id: "basic",
    name: "Humanly Basic",
    description: "7,000 words per month",
    monthlyPrice: 999, // $9.99 in cents
    yearlyPrice: 5988, // $59.88 in cents ($4.99/month × 12)
  },
  {
    id: "pro",
    name: "Humanly Pro",
    description: "30,000 words per month",
    monthlyPrice: 1999, // $19.99 in cents
    yearlyPrice: 17988, // $179.88 in cents ($14.99/month × 12)
  },
  {
    id: "max",
    name: "Humanly Max",
    description: "100,000 words per month",
    monthlyPrice: 3999, // $39.99 in cents
    yearlyPrice: 38388, // $383.88 in cents ($31.99/month × 12)
  },
];

async function createPrices() {
  console.log("🚀 Creating Stripe products and prices...\n");

  for (const plan of PLANS) {
    console.log(`📦 Creating ${plan.name}...`);

    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
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
    });

    console.log(`   ✅ Monthly price: ${monthlyPrice.id}`);
    console.log(
      `      STRIPE_PRICE_${plan.id.toUpperCase()}_MONTHLY=${monthlyPrice.id}`,
    );

    // Create yearly price
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.yearlyPrice,
      currency: "usd",
      recurring: {
        interval: "year",
      },
      nickname: `${plan.name} - Yearly`,
    });

    console.log(`   ✅ Yearly price: ${yearlyPrice.id}`);
    console.log(
      `      STRIPE_PRICE_${plan.id.toUpperCase()}_YEARLY=${yearlyPrice.id}`,
    );
    console.log("");
  }

  console.log("✨ All prices created successfully!");
  console.log("\n📋 Copy these to your .env.local:\n");
}

createPrices().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
```

### Step 2: Install Dependencies

```bash
pnpm add stripe dotenv
```

### Step 3: Run the Script

```bash
node scripts/update-stripe-prices.mjs
```

### Step 4: Copy the Output

The script will output something like:

```
STRIPE_PRICE_BASIC_MONTHLY=price_1ABC123...
STRIPE_PRICE_BASIC_YEARLY=price_1DEF456...
STRIPE_PRICE_PRO_MONTHLY=price_1GHI789...
STRIPE_PRICE_PRO_YEARLY=price_1JKL012...
STRIPE_PRICE_MAX_MONTHLY=price_1MNO345...
STRIPE_PRICE_MAX_YEARLY=price_1PQR678...
```

Copy these to your `.env.local` file!

---

## 🔍 Verify Your Prices

### Check in Stripe Dashboard

1. Go to **Products** in Stripe dashboard
2. You should see:
   - Humanly Basic (2 prices: monthly & yearly)
   - Humanly Pro (2 prices: monthly & yearly)
   - Humanly Max (2 prices: monthly & yearly)

### Test Checkout

1. Start your dev server: `pnpm dev`
2. Go to: http://localhost:3000/pricing
3. Click "Get Started" on Basic plan
4. Verify:
   - ✅ Price shows $9.99/month
   - ✅ Stripe checkout opens
   - ✅ Correct plan name displays
5. Repeat for Pro and Max plans
6. Test yearly prices too!

---

## 📊 Price Comparison

### Your Current Prices (in .env.local)

```env
# These are OLD test prices - need to be replaced
STRIPE_PRICE_BASIC_MONTHLY=price_1TRtO3I1Swpyf5WVFwDdMXK0
STRIPE_PRICE_BASIC_YEARLY=price_1TRtO3I1Swpyf5WVTlFcZw9k
STRIPE_PRICE_PRO_MONTHLY=price_1TRtGvI1Swpyf5WV3bmXFqSq
STRIPE_PRICE_PRO_YEARLY=price_1TRtGwI1Swpyf5WVh8Rco9eZ
STRIPE_PRICE_MAX_MONTHLY=price_1TRtO6I1Swpyf5WVlIyO2pBh
STRIPE_PRICE_MAX_YEARLY=price_1TRtO6I1Swpyf5WVWpicrhS0
```

### Your New Prices (from pricing-data.ts)

| Plan  | Monthly | Yearly (per month) | Yearly (total) |
| ----- | ------- | ------------------ | -------------- |
| Basic | $9.99   | $4.99              | $59.88         |
| Pro   | $19.99  | $14.99             | $179.88        |
| Max   | $39.99  | $31.99             | $383.88        |

---

## ⚠️ Important Notes

### Test Mode vs Live Mode

**Test Mode (for development):**

- Use test Stripe keys
- Create test prices
- No real money charged
- Safe to experiment

**Live Mode (for production):**

- Use live Stripe keys
- Create live prices
- Real money charged
- Only use when ready!

### Current Setup

Your `.env.local` currently has:

```env
# ✅ TEST keys (safe for development)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**This is correct for local development!**

### For Production (Vercel)

1. Create LIVE prices in Stripe (live mode)
2. Add LIVE price IDs to Vercel environment variables
3. Vercel will use LIVE keys from environment variables

---

## 🐛 Troubleshooting

### Issue: "Price not found"

**Cause:** Price ID doesn't exist in Stripe
**Solution:**

1. Check Stripe dashboard
2. Verify price ID is correct
3. Make sure you're in correct mode (test/live)

### Issue: "Wrong price showing in checkout"

**Cause:** Old price IDs still in `.env.local`
**Solution:**

1. Update `.env.local` with new price IDs
2. Restart dev server: `pnpm dev`
3. Clear browser cache

### Issue: "Cannot create price"

**Cause:** API key doesn't have permission
**Solution:**

1. Check you're using correct Stripe key
2. Verify key has write permissions
3. Check Stripe account is active

---

## ✅ Checklist

### Test Mode Setup

- [ ] Create products in Stripe (test mode)
- [ ] Create monthly prices
- [ ] Create yearly prices
- [ ] Copy price IDs to `.env.local`
- [ ] Restart dev server
- [ ] Test checkout for all plans
- [ ] Verify correct prices display

### Live Mode Setup (when ready)

- [ ] Switch to live mode in Stripe
- [ ] Create products in Stripe (live mode)
- [ ] Create monthly prices
- [ ] Create yearly prices
- [ ] Add price IDs to Vercel environment variables
- [ ] Deploy to Vercel
- [ ] Test live checkout
- [ ] Verify webhooks working

---

## 🎯 Quick Summary

**Your new prices:**

- Basic: $9.99/mo or $4.99/mo (yearly)
- Pro: $19.99/mo or $14.99/mo (yearly)
- Max: $39.99/mo or $31.99/mo (yearly)

**To update:**

1. Create products/prices in Stripe dashboard
2. Copy price IDs to `.env.local`
3. Restart server and test
4. Repeat for live mode when ready

**Need help?** Use the automated script in Option 2!
