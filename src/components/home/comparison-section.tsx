"use client";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Compare } from "@/components/ui/compare";
import { COMPARISON_DATA } from "./comparison/comparison-data";
import { ComparisonCard } from "./comparison/comparison-card";
import { Card } from "../ui/card";

export function ComparisonSection() {
  return (
    <section aria-label="Before After Comparison" className="section relative">
      <div className="container-page">
        {/* Header */}
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3 items-center text-center">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ See the Difference
            </Badge>
            <h2 className="text-balance max-w-2xl mx-auto">
              From robotic to natural in seconds
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Watch AI-generated text transform into authentic, human-sounding
              content. Slide to compare the before and after.
            </p>
          </div>
        </BlurFade>

        {/* Comparison */}
        <BlurFade delay={0.2} duration={0.5} inView>
          <div className="flex justify-center">
            <Card className="w-full max-w-4xl p-3 sm:p-4 rounded-2xl overflow-hidden">
              <Compare
                firstContent={
                  <ComparisonCard
                    title={COMPARISON_DATA.before.title}
                    content={COMPARISON_DATA.before.content}
                    label={COMPARISON_DATA.before.label}
                    variant="before"
                  />
                }
                secondContent={
                  <ComparisonCard
                    title={COMPARISON_DATA.after.title}
                    content={COMPARISON_DATA.after.content}
                    label={COMPARISON_DATA.after.label}
                    variant="after"
                  />
                }
                className="h-[280px] sm:h-[380px] md:h-[460px] w-full rounded-2xl"
                slideMode="hover"
                showHandlebar={true}
                initialSliderPercentage={50}
              />
            </Card>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
