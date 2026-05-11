"use client";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { FlowDiagram } from "./how-it-works/flow-diagram";
import { Card } from "../ui/card";

export function HowItWorksSection() {
  return (
    <section aria-label="How it works" className="section">
      <div className="container-page">
        {/* Header */}
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-1 items-center text-center">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ How it works
            </Badge>
            <h2 className="max-w-3xl">
              From robotic AI text to undetectable human writing
            </h2>
            <p className="text-muted-foreground mx-auto text-base">
              Paste any AI-generated content, let Humanly process it, and get
              natural sounding output in seconds.
            </p>
          </div>
        </BlurFade>

        {/* Flow diagram */}
        <BlurFade delay={0.2} duration={0.6} inView>
          <div className="max-w-full mx-auto overflow-hidden">
            <FlowDiagram />
            {/* Bottom step cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 pt-6 px-4 sm:pt-6 border-t border-border">
              {[
                {
                  step: "01",
                  title: "Paste your AI text",
                  desc: "Drop in content from ChatGPT, Gemini, Claude, or any AI tool.",
                },
                {
                  step: "02",
                  title: "Humanly rewrites it",
                  desc: "Our engine strips AI patterns and rebuilds natural sentence flow.",
                },
                {
                  step: "03",
                  title: "Copy human output",
                  desc: "Passes every detector. Ready to publish, submit, or send.",
                },
              ].map((s, i) => (
                <div key={s.step} className="relative">
                  <Card className="flex flex-col gap-2 sm:gap-3 p-4 h-full">
                    <span className="text-xl sm:text-2xl font-black text-primary leading-none select-none">
                      {s.step}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="text-lg sm:text-xs text-muted-foreground leading-relaxed max-w-none">
                      {s.desc}
                    </p>
                  </Card>
                  {i < 2 && (
                    <div className="hidden sm:flex absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="size-5 sm:size-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-sm">
                        <span className="text-primary text-xs">→</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
