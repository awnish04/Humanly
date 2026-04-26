import { NumberTicker } from "@/components/ui/number-ticker";
import { Card } from "@/components/ui/card";
import type { Stat } from "./stats-data";

interface StatCardProps {
  stat: Stat;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <Card className="relative overflow-hidden shadow-sm h-52">
      {/* Icon */}
      <div className="absolute top-6 left-6">
        <div className="flex size-10 items-center justify-center rounded-full border">
          <Icon className="size-5 text-primary" />
        </div>
      </div>

      {/* Number block */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1.5">
        <div className="flex items-end gap-1 leading-none">
          <span className="text-4xl font-black tabular-nums text-foreground leading-none">
            <NumberTicker value={stat.value} decimalPlaces={stat.decimals} />
          </span>
          <span className="mb-0.5 text-xl font-bold text-primary leading-none">
            {stat.suffix}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground max-w-none">
          {stat.label}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-none">
          {stat.description}
        </p>
      </div>
    </Card>
  );
}
