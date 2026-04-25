"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { TrendingUp, Users, Shield, Zap } from "lucide-react";

const STATS = [
  {
    icon: TrendingUp,
    value: 2.4,
    suffix: "M+",
    decimals: 1,
    label: "Words humanized",
    description: "Millions of words transformed into natural human writing.",
  },
  {
    icon: Users,
    value: 38,
    suffix: "k+",
    decimals: 0,
    label: "Active users",
    description: "Writers, students, and marketers trust Humanly daily.",
  },
  {
    icon: Shield,
    value: 99.1,
    suffix: "%",
    decimals: 1,
    label: "Human score avg",
    description: "Average human score across all major AI detectors.",
  },
  {
    icon: Zap,
    value: 12,
    suffix: "",
    decimals: 0,
    label: "Detectors bypassed",
    description: "Tested and verified against every leading detector tool.",
  },
];

/** Pure-CSS box grid — no JS, no canvas, matches the Boxes component look */
function BoxGrid() {
  return (
    <>
      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.4 0.05 250 / 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.4 0.05 250 / 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          transform: "perspective(200px) rotateX(35deg) rotateY(5deg) scale(1)",
          transformOrigin: "top center",
        }}
      />
    </>
  );
}

export function StatsSection() {
  return (
    <section aria-label="Stats" className="section-padding">
      <div className="container-page">
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary">
              ✦ By the numbers
            </span>
            <h2 className="text-balance max-w-xl">
              Trusted by writers worldwide
            </h2>
            <p className="text-muted-foreground max-w-lg text-base">
              Real numbers from real users no marketing fluff.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <BlurFade key={stat.label} delay={i * 0.1} duration={0.5} inView>
                <div className="group relative h-52 overflow-hidden rounded-2xl border border-border bg-card">
                  {/* CSS box grid background */}
                  <BoxGrid />

                  {/* Content */}
                  <div className="relative z-30 flex h-full flex-col justify-between p-6">
                    {/* Icon pill */}
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background/80 backdrop-blur-sm shadow-sm">
                      <Icon className="size-5 text-primary" />
                    </div>

                    {/* Number + label */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-0.5">
                        <span className="text-4xl font-bold tabular-nums text-foreground leading-none">
                          <NumberTicker
                            value={stat.value}
                            decimalPlaces={stat.decimals}
                          />
                        </span>
                        <span className="text-2xl font-bold text-primary leading-none mb-0.5">
                          {stat.suffix}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {stat.label}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-none">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
