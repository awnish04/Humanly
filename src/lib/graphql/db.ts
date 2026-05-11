/**
 * Persistent store backed by Upstash Redis.
 *
 * Set these env vars (Vercel dashboard → Storage → Upstash KV → .env.local):
 *   UPSTASH_REDIS_REST_URL=https://...
 *   UPSTASH_REDIS_REST_TOKEN=...
 *
 * For local dev without Redis, data is kept in-memory (resets on restart).
 */

import { Redis } from "@upstash/redis";
import { PLANS as INITIAL_PLANS } from "@/components/pricing/pricing-data";

export interface StoredPlan {
  id: string;
  name: string;
  desc: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlight: boolean;
  accentColor: string;
  bgColor: string;
  features: string[];
  stripePriceMonthly?: string;
  stripePriceYearly?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredDiscount {
  id: string;
  code: string;
  percentage: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  enabled: boolean;
  showTimer: boolean;
  timerMinutes: number;
  delaySeconds: number;
  expiresAt?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ── Redis client (lazy — only created when env vars are present) ──────────────
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// ── In-memory fallback for local dev ─────────────────────────────────────────
const now = () => new Date().toISOString();

const defaultPlans: StoredPlan[] = INITIAL_PLANS.map((p) => ({
  id: p.id,
  name: p.name,
  desc: p.desc,
  monthlyPrice: p.monthlyPrice,
  yearlyPrice: p.yearlyPrice,
  highlight: p.highlight,
  accentColor: p.accentColor,
  bgColor: p.bgColor,
  features: [...p.features],
  stripePriceMonthly: process.env[`STRIPE_PRICE_${p.id.toUpperCase()}_MONTHLY`],
  stripePriceYearly: process.env[`STRIPE_PRICE_${p.id.toUpperCase()}_YEARLY`],
  createdAt: now(),
  updatedAt: now(),
}));

const defaultDiscounts: StoredDiscount[] = [
  {
    id: "default",
    code: "HUMANLY25",
    percentage: 25,
    title: "🎉 Limited Time Offer!",
    description:
      "Transform your AI content into human-like writing with our premium plans",
    ctaText: "Claim Discount",
    ctaLink: "/pricing",
    enabled: true,
    showTimer: true,
    timerMinutes: 15,
    delaySeconds: 3,
    usageCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
];

// In-memory store used when Redis is not configured
const memStore: {
  plans: StoredPlan[] | null;
  discounts: StoredDiscount[] | null;
} = {
  plans: null,
  discounts: null,
};

// ── Redis keys ────────────────────────────────────────────────────────────────
const KEYS = {
  plans: "humanly:plans",
  discounts: "humanly:discounts",
} as const;

// ── Plans ─────────────────────────────────────────────────────────────────────
export async function getPlans(): Promise<StoredPlan[]> {
  const redis = getRedis();
  if (!redis) {
    return memStore.plans ?? defaultPlans;
  }
  const data = await redis.get<StoredPlan[]>(KEYS.plans);
  return data ?? defaultPlans;
}

export async function savePlans(plans: StoredPlan[]): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    memStore.plans = plans;
    return;
  }
  await redis.set(KEYS.plans, plans);
}

// ── Discounts ─────────────────────────────────────────────────────────────────
export async function getDiscounts(): Promise<StoredDiscount[]> {
  const redis = getRedis();
  if (!redis) {
    return memStore.discounts ?? defaultDiscounts;
  }
  const data = await redis.get<StoredDiscount[]>(KEYS.discounts);
  return data ?? defaultDiscounts;
}

export async function saveDiscounts(
  discounts: StoredDiscount[],
): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    memStore.discounts = discounts;
    return;
  }
  await redis.set(KEYS.discounts, discounts);
}
