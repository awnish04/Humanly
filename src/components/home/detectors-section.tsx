"use client";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { DETECTORS } from "./detectors/detectors-data";
import { DetectorCard } from "./detectors/detector-card";

export function DetectorsSection() {
  const firstRow = DETECTORS.slice(0, Math.ceil(DETECTORS.length / 2));
  const secondRow = DETECTORS.slice(Math.ceil(DETECTORS.length / 2));

  return (
    <section aria-label="AI Detector Comparison" className="section relative">
      <div className="container-page">
        {/* Header */}
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3 items-center text-center">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Undetectable
            </Badge>
            <h2 className="text-balance max-w-2xl mx-auto">
              Beats all major AI detectors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Humanly bypasses every leading AI detection tool. Your content
              passes as 100% human-written, every time.
            </p>
          </div>
        </BlurFade>

        {/* Marquee rows */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover repeat={6} className="[--duration:80s]">
            {firstRow.map((detector) => (
              <DetectorCard key={detector.name} detector={detector} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover repeat={6} className="[--duration:80s]">
            {secondRow.map((detector) => (
              <DetectorCard key={detector.name} detector={detector} />
            ))}
          </Marquee>

          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
}
