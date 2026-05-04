"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Star,
  Diamond,
  BarChart2,
  Sparkles,
  ScanSearch,
  PenLine,
  ArrowRight,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UsageData {
  plan: string;
  planLabel: string;
  wordsUsed: number;
  wordsLimit: number;
  wordsRemaining: number;
  requests: number;
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardPageInner />
    </Suspense>
  );
}

function DashboardPageInner() {
  const { user } = useUser();
  const name = user?.firstName ?? user?.fullName ?? "there";
  const [usage, setUsage] = useState<UsageData | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      // If returning from a successful checkout, sync plan from Stripe first
      if (searchParams.get("checkout") === "success") {
        try {
          await fetch("/api/billing/sync", { method: "POST" });
          toast.success("Subscription activated! Your plan has been updated.");
        } catch {
          // non-fatal
        }
        router.replace("/user-dashboard");
      }

      const res = await fetch("/api/usage");
      const json = await res.json();
      setUsage(json);
    };
    void load();
  }, [searchParams, router]);

  const planLabel = usage?.planLabel ?? "Free";
  const wordsRemaining = usage?.wordsRemaining ?? 500;
  const wordsLimit = usage?.wordsLimit ?? 500;
  const requests = usage?.requests ?? 0;
  const isExhausted = wordsRemaining === 0;
  const isLow = !isExhausted && wordsRemaining <= wordsLimit * 0.1; // under 10%

  return (
    <main className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hello, {name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here&apos;s what&apos;s new today
        </p>
      </div>

      {/* ── Exhaustion / Low balance banner ── */}
      {usage && isExhausted && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
          <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-destructive">
              You&apos;ve used all your words for this month
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your {planLabel} plan limit of {wordsLimit.toLocaleString()} words
              has been reached.
              {usage.plan === "free"
                ? " Upgrade to a paid plan to get more words."
                : " Your balance resets at the start of next month."}
            </p>
          </div>
          {usage.plan === "free" && (
            <Link href="/pricing" className="shrink-0">
              <Button size="sm" className="h-7 text-xs">
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      )}

      {usage && isLow && !isExhausted && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3">
          <AlertTriangle className="size-4 text-yellow-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-yellow-500">
              Running low on words
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Only {wordsRemaining.toLocaleString()} words remaining this month.
              {usage.plan === "free" ? " Consider upgrading for more." : ""}
            </p>
          </div>
          {usage.plan === "free" && (
            <Link href="/pricing" className="shrink-0">
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="size-4" />
            Your Plan
          </div>
          <p className="text-2xl font-black text-foreground">{planLabel}</p>
          {usage?.plan === "free" || !usage ? (
            <Link
              href="/pricing"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="size-3" /> Upgrade Plan
            </Link>
          ) : (
            <Link
              href="/user-dashboard/settings/billing"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="size-3" /> Manage Billing
            </Link>
          )}
        </Card>

        <Card
          className={cn(
            "p-5 flex flex-col gap-3",
            isExhausted && "border-destructive/40",
          )}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Diamond
              className={cn("size-4", isExhausted && "text-destructive")}
            />
            Available Credits
          </div>
          <p
            className={cn(
              "text-2xl font-black",
              isExhausted ? "text-destructive" : "text-foreground",
            )}
          >
            {wordsRemaining.toLocaleString()}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              words
            </span>
          </p>
          {isExhausted ? (
            <Link
              href={usage?.plan === "free" ? "/pricing" : "/user/billing"}
              className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors font-medium"
            >
              <ArrowRight className="size-3" />
              {usage?.plan === "free" ? "Upgrade to get more" : "View billing"}
            </Link>
          ) : (
            <Link
              href="/user-dashboard/settings/billing"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="size-3" /> View usage
            </Link>
          )}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart2 className="size-4" />
            Usage
          </div>
          <p className="text-2xl font-black text-foreground">
            {requests}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              requests this month
            </span>
          </p>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-3" /> Humanize document
          </Link>
        </Card>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Humanizer</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-none">
                Transform AI-generated text into human-like content
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="w-full" size="sm">
              Start Humanizing
            </Button>
          </Link>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-sky-400/10 flex items-center justify-center shrink-0">
              <ScanSearch className="size-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">AI Detector</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-none">
                Check if text was written by AI or a human
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm">
            Detect AI
          </Button>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-violet-400/10 flex items-center justify-center shrink-0">
              <PenLine className="size-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Generate</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-none">
                Generate undetectable AI content
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm">
            Start Writing
          </Button>
        </Card>
      </div>
    </main>
  );
}
