"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Plan } from "./pricing-data";

interface PlanCardProps {
  plan: Plan;
  billing: "monthly" | "yearly";
}

export function PlanCard({ plan, billing }: PlanCardProps) {
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
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full max-w-lg mx-auto">
      {/* "Most Popular" badge floats above the card */}
      {plan.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-lg shadow-primary/30">
            Most Popular
          </Badge>
        </div>
      )}

      <Card
        className={cn(
          "flex flex-col gap-2 p-6 h-full transition-shadow duration-300",
          plan.highlight
            ? "border-primary/60 shadow-xl shadow-primary/10 ring-1 ring-primary"
            : "hover:shadow-md hover:ring-primary",
        )}
      >
        {/* Plan name + description */}
        <div className="text-center ">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.desc}</p>
        </div>

        {/* Price */}
        <div className="flex items-end justify-center gap-1 leading-none">
          <span className="text-2xl font-bold text-foreground self-start mt-1">
            $
          </span>
          <span className="text-4xl font-black text-foreground tabular-nums leading-none">
            {price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground mb-1">/month</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Feature list */}
        <ul className="flex flex-col gap-2 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check
                className="size-4 mt-0.5 shrink-0 text-primary"
                aria-hidden
              />
              <span className="text-sm text-foreground/80 leading-snug">
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <button
          onClick={handleGetStarted}
          disabled={loading}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2",
            plan.highlight
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              : "border border-primary text-primary hover:bg-primary/5",
          )}
        >
          {loading ? (
            <>
              <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            "Get Started"
          )}
        </button>
      </Card>
    </div>
  );
}
