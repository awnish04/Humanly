"use client";

import Link from "next/link";
import { ArrowRightIcon, PlayCircleIcon } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { HeroEyebrow } from "./hero/hero-eyebrow";
import { HumanizerCard } from "./hero/humanizer-card";
import { STATS } from "./stats/stats-data";
import { StatCard } from "./stats/stat-card";

export function HeroSection() {
  return (
    <section
      id="main-content"
      aria-label="AI Text Humanizer"
      // overflow-hidden removed — it was clipping the headline on small screens
      // pt accounts for the floating navbar height
      className="relative flex flex-col items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16"
    >
      {/* Background glow — purely decorative */}
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

      {/* ── Text block ──
          container-page: applies max-width + horizontal padding (matches all other pages)
          w-full: lets it fill the container
          text-center + items-center: centres everything
      */}
      <div className="container-page relative z-10 w-full flex flex-col items-center text-center gap-5">
        {/* Eyebrow badge */}
        <BlurFade delay={0} duration={0.4}>
          <HeroEyebrow />
        </BlurFade>

        {/* Headline
            text-balance: prevents awkward single-word last lines
            max-w-3xl: caps width so it wraps nicely on large screens
        */}
        <BlurFade delay={0.1} duration={0.5}>
          <h1 className="max-w-3xl text-balance">
            <AuroraText>Humanly -</AuroraText> Nobody Will Know It&apos;s{" "}
            <AuroraText>AI Anymore</AuroraText>
          </h1>
        </BlurFade>

        {/* Sub-headline */}
        <BlurFade delay={0.2} duration={0.5}>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Bypass detectors and sound completely natural with content that
            feels like it was written by a real person.
          </p>
        </BlurFade>

        {/* ── CTA buttons ──
            flex-col on mobile → flex-row on sm+
            w-full sm:w-auto: buttons fill width on mobile, auto on desktop
        */}
        <BlurFade delay={0.3} duration={0.4}>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-7 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20"
              >
                Try Humanly Free
                <ArrowRightIcon className="size-4" aria-hidden />
              </Button>
            </Link>
            <Link href="#humanizer" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-7 text-base font-semibold rounded-xl gap-2"
              >
                <PlayCircleIcon className="size-4 text-primary" aria-hidden />
                See How It Works
              </Button>
            </Link>
          </div>
        </BlurFade>

        {/* ── Stats bar ── */}
        <BlurFade delay={0.4} duration={0.5}>
          <div className="flex flex-wrap items-center justify-center rounded-xl border border-border/60 bg-background/70 backdrop-blur-sm shadow-sm overflow-hidden">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </BlurFade>
      </div>

      {/* ── Humanizer card ──
          container-page: same horizontal padding as the rest of the page
          mt-10: gap between text block and card
          id="humanizer": scroll target for the "See How It Works" button
      */}
      <div
        id="humanizer"
        className="relative  z-10 w-full max-w-5xl mt-10"
      >
        <BlurFade delay={0.55} duration={0.6}>
          <HumanizerCard />
        </BlurFade>
      </div>
    </section>
  );
}
