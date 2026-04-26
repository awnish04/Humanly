import { cn } from "@/lib/utils";
import { AVATARS, PLATFORMS } from "./hero-data";

export function HeroSocialProof() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {/* Avatar stack + rating */}
      <div className="flex items-center gap-2.5">
        <div className="flex -space-x-2" aria-hidden>
          {AVATARS.map((a, i) => (
            <span
              key={a}
              className={cn(
                "inline-flex items-center justify-center size-8 rounded-full border-2 border-background text-[10px] font-bold text-primary-foreground select-none",
                ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4"][i],
              )}
            >
              {a}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-yellow-400 text-xs leading-none" aria-hidden>
            ★★★★★
          </span>
          <span className="text-xs text-muted-foreground">1,000+ users</span>
        </div>
      </div>

      <span className="hidden sm:block w-px h-5 bg-border" aria-hidden />

      {/* Platform icons */}
      <div className="flex items-center gap-4">
        {PLATFORMS.map((p) => (
          <span
            key={p.label}
            className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium"
          >
            <svg
              viewBox={p.viewBox}
              className="size-4 fill-current shrink-0"
              aria-hidden
            >
              <path d={p.path} />
            </svg>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
