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
  <div className="flex flex-col items-center gap-1 sm:gap-2">
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-9 sm:size-12 md:size-14 items-center justify-center rounded-xl sm:rounded-2xl border ",
        className,
      )}
    >
      {children}
    </div>
    {label && (
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-[9px] sm:text-xs font-semibold text-foreground leading-tight">
          {label}
        </span>
        {sublabel && (
          <span className="hidden sm:block text-[9px] sm:text-[10px] text-muted-foreground">
            {sublabel}
          </span>
        )}
      </div>
    )}
  </div>
));

Circle.displayName = "Circle";
