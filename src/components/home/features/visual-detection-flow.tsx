"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Zap, Sparkles, CheckCircle } from "lucide-react";

const STEPS = [
  {
    icon: <Zap className="size-4 text-primary shrink-0" />,
    label: "AI-generated text input",
    style: "border-border bg-muted/60 text-muted-foreground",
    delay: 0,
  },
  {
    icon: <Sparkles className="size-4 shrink-0" />,
    label: "Humanly processing…",
    style: "border-primary/40 bg-primary/10 text-primary font-semibold",
    delay: 0.1,
  },
  {
    icon: <CheckCircle className="size-4 shrink-0" />,
    label: "Highly likely to be Human!",
    style: "border-primary bg-primary/10 text-primary font-bold",
    delay: 0.2,
  },
];

export function VisualDetectionFlow() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-8 h-full min-h-[280px]">
      {STEPS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, duration: 0.4, ease: "easeOut" }}
          className="contents"
        >
          {i > 0 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: item.delay - 0.05, duration: 0.3 }}
              className="w-px h-6 bg-primary/40 origin-top"
            />
          )}
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-5 py-3 text-sm w-full max-w-xs",
              item.style,
            )}
          >
            {item.icon}
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
