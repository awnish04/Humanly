"use client";

import { motion } from "motion/react";
import { Shield, CheckCircle } from "lucide-react";

const DETECTORS = ["Turnitin", "GPTZero", "ZeroGPT", "Originality.ai"];

export function VisualBypassFlow() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 h-full min-h-[280px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
      >
        <Shield className="size-4" />
        Humanly Shield Active
      </motion.div>

      <div className="w-px h-4 bg-primary/40" />

      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {DETECTORS.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground"
          >
            <CheckCircle className="size-3 text-primary shrink-0" />
            {d}
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="text-xs text-muted-foreground mt-1"
      >
        All detectors bypassed ✓
      </motion.p>
    </div>
  );
}
