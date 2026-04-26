import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export function HeroEyebrow() {
  return (
    <div className="group relative inline-flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-all duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      {/* Animated gradient border */}
      <span
        className={cn(
          "animate-gradient absolute inset-0 block h-full w-full rounded-full bg-linear-to-r from-(--chart-1)/50 via-(--chart-4)/50 to-(--chart-1)/50 bg-size-[300%_100%] p-px",
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
        }}
      />
      <span className="flex items-center gap-2 text-sm font-medium">
        ✨
        <AnimatedGradientText
          colorFrom="var(--chart-1)"
          colorTo="var(--chart-4)"
          speed={0.8}
        >
          AI-Powered Humanizer
        </AnimatedGradientText>
      </span>
    </div>
  );
}
