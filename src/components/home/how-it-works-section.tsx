"use client";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedDiagram } from "./how-it-works/animated-diagram";

export function HowItWorksSection() {
  return (
    <section aria-label="How it works" className="section">
      <div className="container-page">
        {/* Header */}
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-16 flex flex-col gap-3">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary"
            >
              ✦ How it works
            </Badge>
            <h2 className="text-balance max-w-xl">
              From robotic AI text to
              <br />
              undetectable human writing
            </h2>
            <p className="text-muted-foreground max-w-lg text-base">
              Paste any AI-generated content, let Humanly process it, and get
              natural-sounding output — in seconds.
            </p>
          </div>
        </BlurFade>

        {/* AnimatedBeam diagram with integrated step cards */}
        <BlurFade delay={0.1} duration={0.6} inView>
          <AnimatedDiagram />
        </BlurFade>
      </div>
    </section>
  );
}
