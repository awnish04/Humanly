import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Detector } from "./detectors-data";
import { Card } from "@/components/ui/card";

interface DetectorCardProps {
  detector: Detector;
}

export function DetectorCard({ detector }: DetectorCardProps) {
  return (
    <Card
      className={cn(
        "relative h-full w-72 cursor-pointer overflow-hidden p-5",
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Header with status icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{detector.name}</h3>
          <CheckCircle2 className="size-5 text-primary" />
        </div>

        {/* Score display */}
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-black text-primary leading-none">
            {detector.score}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {detector.status === "bypassed" ? "✓ Bypassed" : "✓ Passed"}
          </p>
        </div>
      </div>
    </Card>
  );
}
