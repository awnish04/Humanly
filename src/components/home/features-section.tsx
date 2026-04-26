"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { FEATURES } from "./features/features-data";
import { FeaturesAccordion } from "./features/features-accordion";

export function FeaturesSection() {
  const [activeId, setActiveId] = useState<string>(FEATURES[0].id);
  const activeIndex = FEATURES.findIndex((f) => f.id === activeId);

  return (
    <section aria-label="Features" className="section relative">
      <div className="container-page">
        {/* Header */}
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Why Humanly
            </Badge>
            <h2 className="text-balance max-w-xl">
              Everything you need to write freely
            </h2>
            <p className="text-muted-foreground max-w-lg text-base">
              From academic papers to SEO content Humanly handles every use case
              with precision and speed.
            </p>
          </div>
        </BlurFade>

        {/* Two-column layout */}
        <div className="flex w-full flex-col items-start gap-10 md:flex-row md:gap-14">
          {/* Left: Accordion */}
          <div className="w-full md:w-1/2">
            <FeaturesAccordion
              features={FEATURES}
              activeId={activeId}
              onActiveChange={setActiveId}
            />
          </div>

          {/* Right: Visual panel (desktop only) */}
          <div className="relative hidden md:block md:w-1/2">
            <Card className="relative overflow-hidden border bg-white/5 backdrop-blur-xs shadow-2xl shadow-primary/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {FEATURES[activeIndex].visual}
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
