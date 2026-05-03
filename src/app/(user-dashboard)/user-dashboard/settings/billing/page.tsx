"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  Zap,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { PLANS } from "@/components/pricing/pricing-data";
import { cn } from "@/lib/utils";

interface BillingData {
  plan: string;
  planName?: string;
  planLabel?: string;
  billing?: "monthly" | "yearly";
  wordsUsed: number;
  wordsLimit: number;
  wordsRemaining: number;
  renewsAt?: string;
  portalUrl?: string;
  error?: string;
}

const FREE_FEATURES = [
  "500 words per month",
  "300 words per input",
  "Basic Humanization Engine",
  "Plagiarism-free",
  "Error-free rewriting",
  "Undetectable results",
  "Unlimited AI detection",
  "Multiple results",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBilling = async () => {
    setLoading(true);
    try {
      // Sync from Stripe first to ensure Clerk metadata is up to date
      await fetch("/api/billing/sync", { method: "POST" });

      // Fetch usage (from Clerk metadata) and Stripe subscription info in parallel
      const [usageRes, stripeRes] = await Promise.all([
        fetch("/api/usage"),
        fetch("/api/billing"),
      ]);
      const usage = await usageRes.json();
      const stripe = await stripeRes.json();

      setData({
        plan: usage.plan ?? "free",
        planLabel: usage.planLabel,
        planName: stripe.planName,
        billing: stripe.billing,
        wordsUsed: usage.wordsUsed ?? 0,
        wordsLimit: usage.wordsLimit ?? 500,
        wordsRemaining: usage.wordsRemaining ?? 500,
        renewsAt: stripe.renewsAt,
        portalUrl: stripe.portalUrl,
      });
    } catch {
      setData({
        plan: "free",
        wordsUsed: 0,
        wordsLimit: 500,
        wordsRemaining: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [usageRes, stripeRes] = await Promise.all([
          fetch("/api/usage"),
          fetch("/api/billing"),
        ]);
        const usage = await usageRes.json();
        const stripe = await stripeRes.json();
        setData({
          plan: usage.plan ?? "free",
          planLabel: usage.planLabel,
          planName: stripe.planName,
          billing: stripe.billing,
          wordsUsed: usage.wordsUsed ?? 0,
          wordsLimit: usage.wordsLimit ?? 500,
          wordsRemaining: usage.wordsRemaining ?? 500,
          renewsAt: stripe.renewsAt,
          portalUrl: stripe.portalUrl,
        });
      } catch {
        setData({
          plan: "free",
          wordsUsed: 0,
          wordsLimit: 500,
          wordsRemaining: 500,
        });
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const isFree = !data || data.plan === "free";
  const activePlan = PLANS.find((p) => p.id === data?.plan);
  const features = activePlan?.features ?? FREE_FEATURES;
  const wordsUsed = data?.wordsUsed ?? 0;
  const wordsLimit = data?.wordsLimit ?? 500;
  const usagePct = Math.min(100, Math.round((wordsUsed / wordsLimit) * 100));
  const wordsRemaining =
    data?.wordsRemaining ?? Math.max(0, wordsLimit - wordsUsed);
  const isExhausted = wordsRemaining === 0 && wordsLimit > 0;
  const isLow = !isExhausted && wordsRemaining <= wordsLimit * 0.1;

  return (
    <main className="p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Manage your subscription, usage, and payment details.
          </p>
        </div>
        <button
          onClick={fetchBilling}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* ── Exhaustion / Low balance banner ── */}
          {isExhausted && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
              <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-destructive">
                  You&apos;ve used all your words for this month
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your {isFree ? "Free" : activePlan?.name} plan limit of{" "}
                  {wordsLimit.toLocaleString()} words has been reached.
                  {isFree
                    ? " Upgrade to a paid plan to continue humanizing."
                    : " Your balance resets at the start of next month."}
                </p>
              </div>
              {isFree && (
                <Link href="/pricing" className="shrink-0">
                  <Button size="sm" className="h-7 text-xs">
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
          )}

          {isLow && !isExhausted && (
            <div className="flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3">
              <AlertTriangle className="size-4 text-yellow-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-yellow-500">
                  Running low on words
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Only {wordsRemaining.toLocaleString()} words remaining this
                  month.
                  {isFree ? " Upgrade for more words." : ""}
                </p>
              </div>
              {isFree && (
                <Link href="/pricing" className="shrink-0">
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* ── Balance / Usage ── */}
          <Card className="p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Balance</h2>
              {data?.renewsAt && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Balance renews on {formatDate(data.renewsAt)} (in{" "}
                  {daysUntil(data.renewsAt)} days)
                </p>
              )}
              <div className="h-px bg-border mt-3" />
            </div>

            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-full",
                  isExhausted ? "bg-destructive/10" : "bg-primary/10",
                )}
              >
                <Zap
                  className={cn(
                    "size-5",
                    isExhausted ? "text-destructive" : "text-primary",
                  )}
                />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">
                  <span className={isExhausted ? "text-destructive" : ""}>
                    {wordsRemaining.toLocaleString()}
                  </span>{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    words
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Used: {wordsUsed.toLocaleString()} /{" "}
                  {wordsLimit.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Remaining</span>
                <span>{100 - usagePct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    usagePct >= 90 ? "bg-destructive" : "bg-primary",
                  )}
                  style={{ width: `${100 - usagePct}%` }}
                />
              </div>
            </div>
          </Card>

          {/* ── Current Plan ── */}
          <Card className="p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Your Plan</h2>
              <div className="h-px bg-border mt-3" />
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-primary shrink-0" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-black text-foreground">
                  {isFree
                    ? "Free"
                    : (data?.planName ?? activePlan?.name ?? data?.plan)}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold uppercase tracking-wide border-primary/40 text-primary bg-primary/10"
                >
                  Active
                </Badge>
                {!isFree && data?.billing && (
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {data.billing}
                  </Badge>
                )}
              </div>
            </div>

            <ul className="flex flex-col gap-1.5">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {isFree ? (
              <Link href="/pricing">
                <Button className="w-fit">Upgrade Plan</Button>
              </Link>
            ) : data?.portalUrl ? (
              <a
                href={data.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-fit">
                  Manage Subscription
                </Button>
              </a>
            ) : null}
          </Card>

          {/* ── Plan & Usage summary ── */}
          <Card className="p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Plan & Usage
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Overview of your current subscription and monthly usage.
              </p>
              <div className="h-px bg-border mt-3" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Current Plan
                </p>
                <p className="text-xl font-black text-primary">
                  {isFree ? "Free" : (activePlan?.name ?? data?.plan)}
                </p>
                {isFree && (
                  <Link
                    href="/pricing"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                  >
                    → Upgrade Plan
                  </Link>
                )}
              </div>

              <div className="rounded-xl border border-border p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Words Remaining
                </p>
                <p className="text-xl font-black text-foreground">
                  {wordsRemaining.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {wordsUsed.toLocaleString()} / {wordsLimit.toLocaleString()}{" "}
                  used
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Billing Cycle
                </p>
                <p className="text-xl font-black text-foreground capitalize">
                  {isFree ? "—" : (data?.billing ?? "—")}
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Renews On
                </p>
                <p className="text-sm font-bold text-foreground">
                  {data?.renewsAt ? formatDate(data.renewsAt) : "—"}
                </p>
                {data?.renewsAt && (
                  <p className="text-xs text-muted-foreground">
                    in {daysUntil(data.renewsAt)} days
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Usage</span>
                <span>{usagePct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    usagePct >= 90 ? "bg-destructive" : "bg-primary",
                  )}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>

            {isFree ? (
              <Link href="/pricing" className="w-fit">
                <Button>Upgrade to Pro</Button>
              </Link>
            ) : data?.portalUrl ? (
              <a
                href={data.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit"
              >
                <Button variant="outline">Manage Subscription</Button>
              </a>
            ) : null}
          </Card>
        </div>
      )}
    </main>
  );
}
