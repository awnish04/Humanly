"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Iphone } from "@/components/ui/iphone";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    desc: "Best for occasional writers",
    monthlyPrice: 9,
    yearlyPrice: 7,
    highlight: false,
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    features: [
      "500 words / humanization",
      "10 humanizations / month",
      "Basic humanization mode",
      "GPTZero & Turnitin bypass",
      "Copy output instantly",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Best for content creators",
    monthlyPrice: 19,
    yearlyPrice: 15,
    highlight: true,
    accentColor: "text-primary",
    bgColor: "bg-primary/10",
    features: [
      "2,000 words / humanization",
      "Unlimited humanizations",
      "All 3 intensity modes",
      "Bypasses all detectors",
      "Priority processing",
      "AI detection checker",
    ],
  },
  {
    id: "business",
    name: "Business",
    desc: "Best for teams & high volume",
    monthlyPrice: 49,
    yearlyPrice: 39,
    highlight: false,
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    features: [
      "5,000 words / humanization",
      "Unlimited humanizations",
      "All 3 intensity modes",
      "Bypasses all detectors",
      "5 team seats",
      "API access",
      "Priority support",
    ],
  },
];

function PlanScreen({
  plan,
  billing,
}: {
  plan: (typeof PLANS)[0];
  billing: "monthly" | "yearly";
}) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

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
        <h3 className={cn(" self-start mt-1", plan.accentColor)}>$</h3>
        <h1 className={cn("tabular-nums leading-none", plan.accentColor)}>
          <NumberTicker value={price} />
        </h1>
        <p className="mb-2">/mo</p>
      </div>

      {/* Divider */}
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
        className={cn(
          "w-full py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all",
          plan.highlight
            ? "bg-primary text-primary-foreground"
            : "border border-border text-foreground",
        )}
      >
        Get Started
      </button>
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <main className=" pt-40">
      <div className="container-page flex flex-col gap-16">
        {/* Header */}
        <BlurFade delay={0} duration={0.5} inView>
          <div className="flex flex-col items-center text-center gap-4">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Pricing
            </Badge>
            <h1 className="text-balance max-w-2xl">
              Choose the plan that suits your needs
            </h1>
            <p className="text-muted-foreground max-w-lg text-base">
              Pick a plan and start humanizing AI content instantly. No credit
              card required to try.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center gap-0 rounded-full border border-border bg-muted p-1 mt-2 relative">
              {(["monthly", "yearly"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setBilling(option)}
                  className="relative z-10 px-5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {/* Sliding background */}
                  {billing === option && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full bg-primary shadow"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      billing === option
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {option === "monthly" ? "Monthly" : "Yearly"}
                  </span>
                  {option === "yearly" && (
                    <span
                      className={cn(
                        "relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors duration-200",
                        billing === "yearly"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      -20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* iPhone pricing cards */}
        <BlurFade delay={0.15} duration={0.5} inView>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col items-center gap-3 transition-all duration-300",
                  plan.highlight
                    ? "md:-translate-y-8"
                    : "opacity-90 hover:opacity-100",
                )}
              >
                {/* Label above phone */}
                <div className="flex flex-col items-center gap-1">
                  <span className={cn("text-sm font-bold", plan.accentColor)}>
                    {plan.name}
                  </span>
                  {plan.highlight && (
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                      Most Popular
                    </Badge>
                  )}
                </div>

                {/* iPhone IS the card */}
                <div className={cn(plan.highlight ? "w-80" : "w-72")}>
                  <Iphone>
                    <PlanScreen plan={plan} billing={billing} />
                  </Iphone>
                </div>
              </div>
            ))}
          </div>
        </BlurFade>

        {/* CTA Banner */}
        <BlurFade delay={0.3} duration={0.5} inView>
          <Card className="p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <div className="flex flex-col gap-3 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                Still not sure? Try it free.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-none">
                No credit card required. Humanize your first 500 words for free
                and see the difference yourself.
              </p>
            </div>

            <blockquote className="border border-border rounded-2xl px-6 py-4 max-w-md">
              <p className="text-sm text-foreground/80 italic max-w-none">
                &ldquo;Humanly saved my entire content pipeline. GPTZero used to
                flag everything — now it passes every time.&rdquo;
              </p>
              <footer className="mt-3 flex items-center justify-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=40&h=40"
                  alt="Sarah Chen"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">
                    Sarah Chen
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Content Marketer
                  </p>
                </div>
              </footer>
            </blockquote>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Button size="lg">Get Started Free</Button>
              <Button size="lg" variant="outline">
                Talk to us
              </Button>
            </div>
          </Card>
        </BlurFade>
      </div>
    </main>
  );
}
