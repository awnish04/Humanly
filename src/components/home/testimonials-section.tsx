"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import {
  TESTIMONIALS,
  type Testimonial,
} from "./testimonials/testimonials-data";
import { Card } from "../ui/card";

const col1 = TESTIMONIALS.slice(0, 4);
const col2 = TESTIMONIALS.slice(4, 8);
const col3 = TESTIMONIALS.slice(8, 12);

function TestimonialCard({
  name,
  username,
  avatar,
  body,
  rating,
}: Testimonial) {
  return (
    <Card
      className={cn(
        "relative w-72 cursor-pointer overflow-hidden rounded-xl border p-4 bg-card",
        "bg-gray-950/1 hover:bg-gray-950/5",
        "dark:bg-gray-50/10 dark:hover:bg-gray-50/15",
        "transition-colors duration-200",
      )}
    >
      <div className="flex flex-row items-center gap-2 mb-3">
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt={name}
          src={avatar}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-foreground">
            {name}
          </figcaption>
          <p className="text-xs text-muted-foreground">{username}</p>
        </div>
        <div className="ml-auto flex gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="size-3 fill-primary text-primary" />
          ))}
        </div>
      </div>
      <blockquote className="text-sm text-muted-foreground leading-relaxed max-w-none">
        &ldquo;{body}&rdquo;
      </blockquote>
    </Card>
  );
}

export function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section relative"
    >
      <div className="container-page">
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3 items-center text-center">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Testimonials
            </Badge>
            <h2
              id="testimonials-heading"
              className="text-balance max-w-2xl mx-auto"
            >
              Trusted by writers, students, and marketers
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Thousands of people use Humanly every day to bypass AI detectors
              and publish with confidence.
            </p>
          </div>
        </BlurFade>

        <div className="relative flex h-[680px] w-full flex-row items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover vertical className="[--duration:80s]">
            {col1.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>

          <Marquee
            reverse
            pauseOnHover
            vertical
            className="[--duration:80s] hidden md:flex"
          >
            {col2.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>

          <Marquee
            pauseOnHover
            vertical
            className="[--duration:80s] hidden lg:flex"
          >
            {col3.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>

          <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b" />
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t" />
        </div>
      </div>
    </section>
  );
}
