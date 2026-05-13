# Quick Guide: Update Stripe Prices

## 🎯 Your New Prices

| Plan      | Monthly | Yearly (per month) | Yearly (total) | Savings |
| --------- | ------- | ------------------ | -------------- | ------- |
| **Basic** | $9.99   | $4.99              | $59.88/year    | 50% off |
| **Pro**   | $19.99  | $14.99             | $179.88/year   | 25% off |
| **Max**   | $39.99  | $31.99             | $383.88/year   | 20% off |

---

## 🚀 Fastest Way: Use the Automated Script

### Step 1: Install Dependencies

```bash
pnpm add stripe dotenv
```

### Step 2: Run the Script

```bash
node scripts/update-stripe-prices.mjs
```

### Step 3: Copy the Output

The script will output something like:

```env
STRIPE_PRICE_BASIC_MONTHLY=price_1ABC123...
STRIPE_PRICE_BASIC_YEARLY=price_1DEF456...
STRIPE_PRICE_PRO_MONTHLY=price_1GHI789...
STRIPE_PRICE_PRO_YEARLY=price_1JKL012...
STRIPE_PRICE_MAX_MONTHLY=price_1MNO345...
STRIPE_PRICE_MAX_YEARLY=price_1PQR678...
```

### Step 4: Update .env.local

Replace the old price IDs in your `.env.local` with the new ones.

### Step 5: Restart Server

```bash
pnpm dev
```

### Step 6: Test

Go to http://localhost:3000/pricing and test checkout!

---

## 📖 Manual Way: Stripe Dashboard

If you prefer to do it manually, see `STRIPE_PRICE_UPDATE_GUIDE.md` for detailed instructions.

---

## ⚠️ Important

- ✅ Script uses TEST mode by default (safe!)
- ✅ No real money charged in test mode
- ⚠️ For production, run script again in LIVE mode
- ⚠️ Add LIVE price IDs to Vercel environment variables

---

## 🐛 Troubleshooting

**Error: "STRIPE_SECRET_KEY not found"**

- Make sure `.env.local` has `STRIPE_SECRET_KEY="sk_test_..."`

**Error: "stripe is not defined"**

- Run: `pnpm add stripe dotenv`

**Wrong prices showing**

- Update `.env.local` with new price IDs
- Restart server: `pnpm dev`
- Clear browser cache

---

## ✅ Quick Checklist

- [ ] Install dependencies (`pnpm add stripe dotenv`)
- [ ] Run script (`node scripts/update-stripe-prices.mjs`)
- [ ] Copy price IDs to `.env.local`
- [ ] Restart server (`pnpm dev`)
- [ ] Test at http://localhost:3000/pricing
- [ ] Verify correct prices in checkout

Done! 🎉
