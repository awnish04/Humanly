"use client";

import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  title: string;
  content: string;
  label: string;
  variant: "before" | "after";
}

export function ComparisonCard({
  title,
  content,
  label,
  variant,
}: ComparisonCardProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col p-6 sm:p-10 rounded-2xl overflow-hidden",
        variant === "before" ? "bg-destructive/10" : "bg-primary/10",
      )}
    >
      {/* Label */}
      <span
        className={cn(
          "text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 shrink-0",
          variant === "before" ? "text-destructive" : "text-primary",
        )}
      >
        {label}
      </span>

      {/* Title */}
      <h3 className="text-sm sm:text-xl font-bold text-foreground leading-tight mb-4 shrink-0">
        {title}
      </h3>

      {/* Divider */}
      <div
        className={cn(
          "h-px w-full mb-4 shrink-0",
          variant === "before" ? "bg-destructive/20" : "bg-primary/20",
        )}
      />

      {/* Content — fills remaining space, no overflow */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <p className="text-xs sm:text-sm md:text-base text-foreground/80 leading-relaxed text-justify max-w-none">
          {content}
        </p>
      </div>
    </div>
  );
}
