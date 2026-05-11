/* eslint-disable @next/next/no-img-element */
import type { Detector } from "./detectors-data";

interface DetectorCardProps {
  detector: Detector;
}

export function DetectorCard({ detector }: DetectorCardProps) {
  return (
    <div className="flex items-center gap-2.5 px-6 shrink-0">
      <img
        src={detector.logo}
        alt={`${detector.name} logo`}
        width={32}
        height={32}
        className="size-15 rounded-full object-cover shrink-0"
      />
      <span className="text-2xl font-semibold text-foreground/70 whitespace-nowrap">
        {detector.name}
      </span>
    </div>
  );
}
