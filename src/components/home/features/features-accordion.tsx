"use client";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion } from "motion/react";
import type { Feature } from "./features-data";

interface FeaturesAccordionProps {
  features: Feature[];
  activeId: string;
  onActiveChange: (id: string) => void;
}

export function FeaturesAccordion({
  features,
  activeId,
  onActiveChange,
}: FeaturesAccordionProps) {
  return (
    <Accordion multiple={false} defaultValue={[features[0].id]}>
      {features.map((feature, i) => (
        <BlurFade key={feature.id} delay={i * 0.08} duration={0.4} inView>
          <AccordionItem
            value={feature.id}
            className="transition-all duration-300"
            onOpenChange={(open) => {
              if (open) onActiveChange(feature.id);
            }}
          >
            <AccordionTrigger className="py-5 text-left no-underline! group">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: activeId === feature.id ? 1 : 0.5,
                    opacity: activeId === feature.id ? 1 : 0.2,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="size-2 rounded-full bg-primary shrink-0"
                />
                <span
                  className={cn(
                    "text-lg font-semibold transition-colors duration-300",
                    activeId === feature.id
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {feature.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-5">
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-base text-muted-foreground leading-relaxed"
              >
                {feature.description}
              </motion.p>
              {/* Mobile visual */}
              <div className="mt-5 md:hidden rounded-2xl border border-border bg-card overflow-hidden">
                {feature.visual}
              </div>
            </AccordionContent>
          </AccordionItem>
        </BlurFade>
      ))}
    </Accordion>
  );
}
