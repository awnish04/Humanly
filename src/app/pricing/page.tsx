"use client";

import { useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { AuroraText } from "@/components/ui/aurora-text";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/components/pricing/pricing-data";
import { BillingToggle } from "@/components/pricing/billing-toggle";
import { PlanCard } from "@/components/pricing/plan-card";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <>
      {/* Hero */}
      <section
        aria-label="Pricing hero"
        className="relative flex flex-col items-center justify-center overflow-hidden pt-32 "
      >
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute rounded-full opacity-[0.15] blur-2xl"
            style={{
              width: "min(640px, 90vw)",
              height: "min(640px, 90vw)",
              background:
                "radial-gradient(circle, var(--primary) 0%, transparent 90%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="container-page relative z-10 flex flex-col items-center text-center gap-5">
          <BlurFade delay={0} duration={0.4} inView>
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Pricing
            </Badge>
          </BlurFade>

          <BlurFade delay={0.1} duration={0.5} inView>
            <h1 className="text-balance max-w-3xl">
              Choose the plan that suits <AuroraText>your needs</AuroraText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.5} inView>
            <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-balance mx-auto">
              Pick a plan and start humanizing AI content instantly. No credit
              card required to try.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} duration={0.4} inView>
            <BillingToggle billing={billing} onChange={setBilling} />
          </BlurFade>
        </div>

        {/* Plans */}
        <div className="section container-page">
          <BlurFade delay={0} duration={0.5} inView>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
              {PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} billing={billing} />
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      <PricingFaq />
    </>
  );
}
