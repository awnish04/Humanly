"use client";

import { motion } from "motion/react";
import { Search, CheckCircle } from "lucide-react";

const ITEMS = [
  "Natural keyword density",
  "Human readability score: 98%",
  "Zero AI detection flags",
  "Google-safe content",
];

export function VisualSEOFlow() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 h-full min-h-[280px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
      >
        <Search className="size-4" />
        SEO-Optimised Output
      </motion.div>

      <div className="w-px h-4 bg-primary/40" />

      <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground"
          >
            <CheckCircle className="size-3 text-primary shrink-0" />
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
