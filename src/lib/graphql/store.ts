/**
 * In-memory store for plans and discounts.
 * In production, replace with a real database (Prisma, Drizzle, etc.)
 */

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

// Seed from pricing-data.ts
const now = new Date().toISOString();

export const plansStore: StoredPlan[] = INITIAL_PLANS.map((p) => ({
  id: p.id,
  name: p.name,
  desc: p.desc,
  monthlyPrice: p.monthlyPrice,
  yearlyPrice: p.yearlyPrice,
  highlight: p.highlight,
  accentColor: p.accentColor,
  bgColor: p.bgColor,
  features: p.features,
  stripePriceMonthly: process.env[`STRIPE_PRICE_${p.id.toUpperCase()}_MONTHLY`],
  stripePriceYearly: process.env[`STRIPE_PRICE_${p.id.toUpperCase()}_YEARLY`],
  createdAt: now,
  updatedAt: now,
}));

export const discountsStore: StoredDiscount[] = [
  {
    id: "default",
    code: "HUMANLY25",
    percentage: 25,
    title: "🎉 Limited Time Offer!",
    description:
      "Transform your AI content into human-like writing with our premium plans",
    ctaText: "Get 25% Off Now",
    ctaLink: "/pricing",
    enabled: true,
    showTimer: true,
    timerMinutes: 15,
    delaySeconds: 3,
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  },
];
