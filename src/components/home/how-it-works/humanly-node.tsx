import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export const HumanlyNode = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-20 items-center justify-center rounded-3xl border-2 border-primary bg-primary/10 shadow-lg shadow-primary/20",
          className,
        )}
      >
        <Sparkles className="size-8 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-bold text-foreground">Humanly</span>
        <span className="text-xs text-muted-foreground">AI Engine</span>
      </div>
    </div>
  ),
);

HumanlyNode.displayName = "HumanlyNode";
