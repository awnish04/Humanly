"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { AuroraText } from "@/components/ui/aurora-text";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { HeroEyebrow } from "./hero/hero-eyebrow";
import { HeroSocialProof } from "./hero/hero-social-proof";
import { HumanizerCard } from "./hero/humanizer-card";

export function HeroSection() {
  return (
    <section
      id="main-content"
      aria-label="AI Text Humanizer"
      className="relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute rounded-full opacity-[0.15] blur-2xl"
          style={{
            width: "min(640px, 90vw)",
            height: "min(640px, 90vw)",
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center text-center gap-6">
            {/* Eyebrow badge */}
            <BlurFade delay={0} duration={0.4}>
              <HeroEyebrow />
            </BlurFade>

            {/* Headline */}
            <BlurFade delay={0.1} duration={0.5}>
              <h1 className="text-balance max-w-3xl">
                Make AI Content Sound <AuroraText>100% Human</AuroraText>
              </h1>
            </BlurFade>

            {/* Sub-headline */}
            <BlurFade delay={0.2} duration={0.5}>
              <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-balance mx-auto">
                Transform robotic ChatGPT or any AI drafts into natural,
                engaging writing. Works for blogs, emails, and social posts.
              </p>
            </BlurFade>

            {/* Social proof */}
            <BlurFade delay={0.3} duration={0.4}>
              <HeroSocialProof />
            </BlurFade>
          </div>
        }
      >
        <HumanizerCard />
      </ContainerScroll>
    </section>
  );
}
