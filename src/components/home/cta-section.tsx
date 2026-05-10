import {
  ArrowRightIcon,
  PlusIcon,
  SparklesIcon,
  ZapIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  { icon: ZapIcon, label: "Instant humanization" },
  { icon: ShieldCheckIcon, label: "Bypasses all major detectors" },
  { icon: SparklesIcon, label: "No credit card required" },
];

export function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="section container-page flex items-center justify-center"
    >
      <div className="relative mx-auto flex w-full flex-col items-center justify-between gap-y-4 border border-border px-6 py-12 sm:px-10 sm:py-10">
        {/* Corner plus icons */}
        <PlusIcon
          className="absolute -top-3 -left-3 z-10 size-6 text-primary"
          strokeWidth={1}
          aria-hidden
        />
        <PlusIcon
          className="absolute -top-3 -right-3 z-10 size-6 text-primary"
          strokeWidth={1}
          aria-hidden
        />
        <PlusIcon
          className="absolute -bottom-3 -left-3 z-10 size-6 text-primary"
          strokeWidth={1}
          aria-hidden
        />
        <PlusIcon
          className="absolute -bottom-3 -right-3 z-10 size-6 text-primary"
          strokeWidth={1}
          aria-hidden
        />



        {/* Eyebrow */}
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
          <SparklesIcon className="size-3.5 text-primary" aria-hidden />
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">
            Start for free today
          </span>
        </div>

        {/* Headline */}
        <div className="items-center justify-center text-center">
          <h2 id="cta-heading">
            Make Your AI Writing{" "}
            <span className="text-primary">Undetectable</span>
          </h2>
          <p className="mx-auto max-w-4xl text-center text-base text-muted-foreground">
            Join thousands of students, writers, and professionals who trust
            Humanly to bypass every AI detector instantly.
          </p>
        </div>

        {/* Feature highlights */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Icon className="size-4 text-primary shrink-0" aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8"
            >
              Contact
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto px-8 gap-2">
              Get Started Free
              <ArrowRightIcon className="size-4" aria-hidden />
            </Button>
          </Link>
        </div>

        {/* Fine print */}
        <p className="text-xs text-muted-foreground text-center">
          Free plan includes 500 words/month. No credit card needed.
        </p>
      </div>
    </section>
  );
}
