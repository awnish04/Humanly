/**
 * Resets a user's plan back to free in Clerk metadata.
 * Run: node scripts/reset-user-plan.mjs <userId>
 *
 * Find your userId in Clerk Dashboard → Users → click your user → copy the ID (user_xxx)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const userId = process.argv[2];
if (!userId) {
  console.error("❌  Usage: node scripts/reset-user-plan.mjs <userId>");
  console.error("     Find your userId in Clerk Dashboard → Users");
  process.exit(1);
}

const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");

const clerkSecretMatch = envContent.match(
  /^CLERK_SECRET_KEY=["']?(.+?)["']?$/m,
);
if (!clerkSecretMatch) {
  console.error("❌  CLERK_SECRET_KEY not found in .env.local");
  process.exit(1);
}
const CLERK_SECRET_KEY = clerkSecretMatch[1].trim();

console.log(`\n🔄  Resetting plan for user: ${userId}\n`);

const res = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${CLERK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    public_metadata: {
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
  }),
});

const data = await res.json();
if (!res.ok) {
  console.error(
    "❌  Clerk API error:",
    data.errors?.[0]?.message ?? JSON.stringify(data),
  );
  process.exit(1);
}

console.log("✅  User reset to free plan successfully.");
console.log("   plan: free | wordsLimit: 500 | wordsUsed: 0\n");
