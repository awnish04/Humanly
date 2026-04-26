"use client";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedDiagram } from "./how-it-works/animated-diagram";
import { Card } from "../ui/card";

export function HowItWorksSection() {
  return (
    <section aria-label="How it works" className="section">
      <div className="container-page">
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3 items-center text-center">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ How it works
            </Badge>
            <h2 className="text-balance max-w-2xl mx-auto">
              From robotic AI text to
              <br />
              undetectable human writing
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              Paste any AI-generated content, let Humanly process it, and get
              natural-sounding output — in seconds.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} duration={0.6} inView>
          <Card className="max-w-4xl mx-auto border overflow-hidden bg-card backdrop-blur-xs">
            <AnimatedDiagram />
          </Card>
        </BlurFade>
      </div>
    </section>
  );
}
