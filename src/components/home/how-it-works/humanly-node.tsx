import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export const HumanlyNode = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-9 sm:size-12 md:size-14 items-center justify-center rounded-xl sm:rounded-2xl border  border-primary bg-primary/10 shadow-lg shadow-primary/20",
          className,
        )}
      >
        {/* "z-10 flex size-9 sm:size-12 md:size-14 items-center justify-center
        rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm", */}
        <Sparkles className="size-6 sm:size-7 md:size-8 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs sm:text-sm font-bold text-foreground">
          Humanly
        </span>
        <span className="text-[10px] sm:text-xs text-muted-foreground">
          AI Engine
        </span>
      </div>
    </div>
  ),
);

HumanlyNode.displayName = "HumanlyNode";
