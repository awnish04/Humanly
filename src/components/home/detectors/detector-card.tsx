/* eslint-disable @next/next/no-img-element */
import type { Detector } from "./detectors-data";

interface DetectorCardProps {
  detector: Detector;
}

export function DetectorCard({ detector }: DetectorCardProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 lg:px-6 shrink-0">
      <img
        src={detector.logo}
        alt={`${detector.name} logo`}
        width={32}
        height={32}
        className="size-7 sm:size-9 lg:size-12 rounded-full object-cover shrink-0"
      />
      <span className="text-xs sm:text-base lg:text-lg font-semibold text-foreground/70 whitespace-nowrap">
        {detector.name}
      </span>
    </div>
  );
}
