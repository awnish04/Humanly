"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { STATS } from "./stats/stats-data";
import { StatCard } from "./stats/stat-card";

export function StatsSection() {
  return (
    <section aria-label="Stats" className="section relative overflow-hidden">
      <div className="container-page">
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary">
              ✦ By the numbers
            </span>
            <h2 className="text-balance max-w-xl">
              Trusted by writers worldwide
            </h2>
            <p className="max-w-lg text-base">
              Real numbers from real users — no marketing fluff.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <BlurFade key={stat.label} delay={i * 0.1} duration={0.5} inView>
              <StatCard stat={stat} />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
