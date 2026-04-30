"use client";

import { Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Separator } from "@/components/ui/separator";
import type { Plan } from "./pricing-data";
import { useState } from "react";

interface PlanScreenProps {
  plan: Plan;
  billing: "monthly" | "yearly";
}

export function PlanScreen({ plan, billing }: PlanScreenProps) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, billing }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to create checkout session");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-background flex flex-col overflow-hidden px-5 pt-18 pb-5 gap-3">
      {/* Plan name + desc */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <h3>{plan.name}</h3>
        <p className="text-sm text-muted-foreground leading-tight">
          {plan.desc}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 leading-none shrink-0">
        <h3 className={cn("self-start mt-1", plan.accentColor)}>$</h3>
        <h1 className={cn("tabular-nums leading-none", plan.accentColor)}>
          <NumberTicker value={price} />
        </h1>
        <p className="mb-2">/month</p>
      </div>

      <Separator className="my-2" />

      {/* Features */}
      <ul className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className={cn("size-4 mt-0.5 shrink-0", plan.accentColor)} />
            <span className="text-sm text-foreground/80 leading-tight">
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={handleGetStarted}
        disabled={loading}
        className={cn(
          "w-full py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2",
          plan.highlight
            ? "bg-primary text-primary-foreground"
            : "border border-border text-foreground",
        )}
      >
        {loading ? (
          <>
            <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          "Get Started"
        )}
      </button>
    </div>
  );
}
