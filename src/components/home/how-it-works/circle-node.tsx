import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Circle = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children?: React.ReactNode;
    label?: string;
    sublabel?: string;
  }
>(({ className, children, label, sublabel }, ref) => (
  <div className="flex flex-col items-center gap-2">
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      {children}
    </div>
    {label && (
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {sublabel && (
          <span className="text-[10px] text-muted-foreground">{sublabel}</span>
        )}
      </div>
    )}
  </div>
));

Circle.displayName = "Circle";
