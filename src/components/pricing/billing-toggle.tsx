"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

interface BillingToggleProps {
  billing: Billing;
  onChange: (billing: Billing) => void;
}

export function BillingToggle({ billing, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center gap-0 rounded-full border border-border bg-muted p-1 relative">
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="relative z-10 px-5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2"
        >
          {billing === option && (
            <motion.span
              layoutId="billing-pill"
              className="absolute inset-0 rounded-full bg-primary shadow"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={cn(
              "relative z-10 transition-colors duration-200",
              billing === option
                ? "text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {option === "monthly" ? "Monthly" : "Yearly"}
          </span>
          {option === "yearly" && (
            <span
              className={cn(
                "relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors duration-200",
                billing === "yearly"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary",
              )}
            >
              -20%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
