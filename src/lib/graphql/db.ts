/**
 * Simple file-based persistent store.
 * Reads/writes JSON to /data/*.json so data survives server restarts.
 * In production, replace with a real database.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
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

const DATA_DIR = join(process.cwd(), "data");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  const path = join(DATA_DIR, file);
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(file: string, data: T): void {
  ensureDir();
  writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// ── Seed defaults ─────────────────────────────────────────────────────────────
const now = new Date().toISOString();

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
  createdAt: now,
  updatedAt: now,
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
    createdAt: now,
    updatedAt: now,
  },
];

// ── Public API ────────────────────────────────────────────────────────────────
export function getPlans(): StoredPlan[] {
  return readJSON<StoredPlan[]>("plans.json", defaultPlans);
}

export function savePlans(plans: StoredPlan[]): void {
  writeJSON("plans.json", plans);
}

export function getDiscounts(): StoredDiscount[] {
  return readJSON<StoredDiscount[]>("discounts.json", defaultDiscounts);
}

export function saveDiscounts(discounts: StoredDiscount[]): void {
  writeJSON("discounts.json", discounts);
}
