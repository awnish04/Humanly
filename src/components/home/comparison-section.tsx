"use client";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Compare } from "@/components/ui/compare";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { COMPARISON_DATA } from "./comparison/comparison-data";
import { ComparisonCard } from "./comparison/comparison-card";
import { Card } from "../ui/card";

export function ComparisonSection() {
  return (
    <section aria-label="Before After Comparison" className="relative">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col gap-3 items-center text-center">
            <BlurFade delay={0} duration={0.5} inView>
              <Badge
                variant="outline"
                className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
              >
                ✦ See the Difference
              </Badge>
            </BlurFade>

            <BlurFade delay={0.1} duration={0.5} inView>
              <h2 className="text-balance max-w-2xl mx-auto">
                From robotic to natural in seconds
              </h2>
            </BlurFade>

            <BlurFade delay={0.2} duration={0.5} inView>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base">
                Watch AI-generated text transform into authentic, human-sounding
                content. Hover to compare the before and after.
              </p>
            </BlurFade>
          </div>
        }
      >
        <Card className="w-full p-3 sm:p-4 overflow-hidden min-h-[350px] sm:min-h-[420px] lg:min-h-[480px]">
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
            className="w-full min-h-[500px]"
            slideMode="hover"
            showHandlebar={true}
            initialSliderPercentage={50}
          />
        </Card>
      </ContainerScroll>
    </section>
  );
}
