import { NumberTicker } from "@/components/ui/number-ticker";
import type { Stat } from "./stats-data";

interface StatCardProps {
  stat: Stat;
  index: number; // used to show/hide the left divider
}

export function StatCard({ stat, index }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3 sm:px-6 relative">
      {/* Vertical divider — hidden on the first item */}
      {index > 0 && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-px bg-border"
          aria-hidden
        />
      )}

      {/* Animated number + suffix */}
      <span className="text-lg sm:text-2xl font-black text-primary leading-none flex items-baseline gap-0.5">
        <NumberTicker
          value={stat.value}
          decimalPlaces={stat.decimals}
          className="tabular-nums"
        />
        <span>{stat.suffix}</span>
      </span>

      {/* Label */}
      <span className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
        {stat.label}
      </span>
    </div>
  );
}
