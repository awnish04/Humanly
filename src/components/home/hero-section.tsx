"use client";

import Link from "next/link";
import { ArrowRightIcon, PlayCircleIcon } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { AuroraText } from "@/components/ui/aurora-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { HeroEyebrow } from "./hero/hero-eyebrow";
import { HumanizerCard } from "./hero/humanizer-card";
import { STATS } from "./stats/stats-data";

export function HeroSection() {
  return (
    <section
      id="main-content"
      aria-label="AI Text Humanizer"
      className="relative flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-4"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute rounded-full opacity-[0.15] blur-3xl"
          style={{
            width: "min(700px, 100vw)",
            height: "min(700px, 100vw)",
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* ── Text block ── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
        {/* Eyebrow badge */}
        <BlurFade delay={0} duration={0.4}>
          <HeroEyebrow />
        </BlurFade>

        {/* Headline */}
        <BlurFade delay={0.1} duration={0.5}>
          <h1 className="max-w-3xl">
            <AuroraText>Humanly - </AuroraText> Nobody Will Know It&apos;s{" "}
            <AuroraText>AI Anymore</AuroraText>
          </h1>
        </BlurFade>

        {/* Sub-headline */}
        <BlurFade delay={0.2} duration={0.5}>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Bypass detectors and sound completely natural with content that
            feels like it was written by a real person.
          </p>
        </BlurFade>

        {/* ── CTA buttons ── */}
        <BlurFade delay={0.3} duration={0.4}>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 px-7 text-base font-semibold rounded-full gap-2 shadow-lg shadow-primary/20"
              >
                Try Humanly Free
                <ArrowRightIcon className="size-4" aria-hidden />
              </Button>
            </Link>
            <Link href="#humanizer">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-7 text-base font-semibold rounded-full gap-2"
              >
                <PlayCircleIcon className="size-4 text-primary" aria-hidden />
                See How It Works
              </Button>
            </Link>
          </div>
        </BlurFade>

        {/* ── Inline stats bar ── */}
        <BlurFade delay={0.4} duration={0.5}>
          <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-background/70 backdrop-blur-sm shadow-sm overflow-hidden">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center px-5 py-3 sm:px-7 relative"
              >
                {i > 0 && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-px bg-border"
                    aria-hidden
                  />
                )}
                <span className="text-xl sm:text-2xl font-black text-primary leading-none flex items-baseline gap-0.5">
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimals}
                    className="tabular-nums"
                  />
                  <span>{stat.suffix}</span>
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>

      {/* ── Humanizer card ── */}
      <div id="humanizer" className="relative z-10 w-full max-w-5xl mt-10">
        <BlurFade delay={0.55} duration={0.6}>
          <HumanizerCard />
        </BlurFade>
      </div>
    </section>
  );
}
