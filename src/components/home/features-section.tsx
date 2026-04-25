"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  Shield,
  Zap,
  Search,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Card } from "../ui/card";

interface Feature {
  id: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}

/* ── Visual panels ──────────────────────────────────────── */
function VisualDetectionFlow() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-8 h-full min-h-[280px]">
      {[
        {
          icon: <Zap className="size-4 text-primary shrink-0" />,
          label: "AI-generated text input",
          style: "border-border bg-muted/60 text-muted-foreground",
          delay: 0,
        },
        {
          icon: <Sparkles className="size-4 shrink-0" />,
          label: "Humanly processing…",
          style: "border-primary/40 bg-primary/10 text-primary font-semibold",
          delay: 0.1,
        },
        {
          icon: <CheckCircle className="size-4 shrink-0" />,
          label: "Highly likely to be Human!",
          style: "border-primary bg-primary/10 text-primary font-bold",
          delay: 0.2,
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, duration: 0.4, ease: "easeOut" }}
          className="contents"
        >
          {i > 0 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: item.delay - 0.05, duration: 0.3 }}
              className="w-px h-6 bg-primary/40 origin-top"
            />
          )}
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-5 py-3 text-sm w-full max-w-xs",
              item.style,
            )}
          >
            {item.icon}
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VisualBypassFlow() {
  const detectors = ["Turnitin", "GPTZero", "ZeroGPT", "Originality.ai"];
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 h-full min-h-[280px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
      >
        <Shield className="size-4" />
        Humanly Shield Active
      </motion.div>
      <div className="w-px h-4 bg-primary/40" />
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {detectors.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground"
          >
            <CheckCircle className="size-3 text-primary shrink-0" />
            {d}
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="text-xs text-muted-foreground mt-1"
      >
        All detectors bypassed ✓
      </motion.p>
    </div>
  );
}

function VisualAcademicFlow() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-8 h-full min-h-[280px]">
      {[
        {
          icon: <BookOpen className="size-4 text-primary shrink-0" />,
          label: "Essay / Research Paper",
          style: "border-border bg-muted/60 text-muted-foreground",
          delay: 0,
        },
        {
          icon: <Sparkles className="size-4 shrink-0" />,
          label: "Tone preserved, AI removed",
          style: "border-primary/40 bg-primary/10 text-primary font-semibold",
          delay: 0.1,
        },
        {
          icon: <CheckCircle className="size-4 shrink-0" />,
          label: "Ready to submit",
          style: "border-primary bg-primary/10 text-primary font-bold",
          delay: 0.2,
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, duration: 0.4, ease: "easeOut" }}
          className="contents"
        >
          {i > 0 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: item.delay - 0.05, duration: 0.3 }}
              className="w-px h-6 bg-primary/40 origin-top"
            />
          )}
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-5 py-3 text-sm w-full max-w-xs",
              item.style,
            )}
          >
            {item.icon}
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VisualSEOFlow() {
  const items = [
    "Natural keyword density",
    "Human readability score: 98%",
    "Zero AI detection flags",
    "Google-safe content",
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 h-full min-h-[280px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
      >
        <Search className="size-4" />
        SEO-Optimised Output
      </motion.div>
      <div className="w-px h-4 bg-primary/40" />
      <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground"
          >
            <CheckCircle className="size-3 text-primary shrink-0" />
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const FEATURES: Feature[] = [
  {
    id: "humanize",
    title: "Instant AI Humanization",
    description:
      "Paste any AI-generated text and get natural, human-sounding output in seconds. Humanly rewrites robotic phrasing while preserving your original meaning and intent.",
    visual: <VisualDetectionFlow />,
  },
  {
    id: "bypass",
    title: "Bypass Every AI Detector",
    description:
      "Tested and proven against Turnitin, GPTZero, ZeroGPT, Originality.ai, and more. Our advanced rewriting engine ensures your content passes every major detection tool.",
    visual: <VisualBypassFlow />,
  },
  {
    id: "academic",
    title: "Academic & Professional Writing",
    description:
      "Submit essays, research papers, and reports with confidence. Humanly preserves your voice and argument structure while removing all AI detection signals.",
    visual: <VisualAcademicFlow />,
  },
  {
    id: "seo",
    title: "SEO-Safe Content at Scale",
    description:
      "Create blog posts, product descriptions, and landing pages that rank on Google — without the risk of AI content penalties. Human-sounding copy that converts.",
    visual: <VisualSEOFlow />,
  },
];

export function FeaturesSection() {
  const [activeId, setActiveId] = useState<string>(FEATURES[0].id);
  const activeIndex = FEATURES.findIndex((f) => f.id === activeId);

  return (
    <section aria-label="Features" className="section">
      <div className="container-page">
        {/* Header */}
        <BlurFade delay={0} duration={0.5} inView>
          <div className="mb-12 flex flex-col gap-3">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Why Humanly
            </Badge>
            <h2 className="text-balance max-w-xl">
              Everything you need to write freely
            </h2>
            <p className="text-muted-foreground max-w-lg text-base">
              From academic papers to SEO content — Humanly handles every use
              case with precision and speed.
            </p>
          </div>
        </BlurFade>

        {/* Two-column layout */}
        <div className="flex w-full flex-col items-start gap-10 md:flex-row md:gap-14">
          {/* Left: Accordion */}
          <div className="w-full md:w-1/2">
            <Accordion multiple={false} defaultValue={[FEATURES[0].id]}>
              {FEATURES.map((feature, i) => (
                <BlurFade
                  key={feature.id}
                  delay={i * 0.08}
                  duration={0.4}
                  inView
                >
                  <AccordionItem
                    value={feature.id}
                    className="transition-all duration-300"
                    onOpenChange={(open) => {
                      if (open) setActiveId(feature.id);
                    }}
                  >
                    <AccordionTrigger className="py-5 text-left no-underline! group">
                      <div className="flex items-center gap-3">
                        {/* Active indicator dot */}
                        <motion.div
                          animate={{
                            scale: activeId === feature.id ? 1 : 0.5,
                            opacity: activeId === feature.id ? 1 : 0.2,
                          }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="size-2 rounded-full bg-primary shrink-0"
                        />
                        <span
                          className={cn(
                            "text-lg font-semibold transition-colors duration-300",
                            activeId === feature.id
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {feature.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-5">
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-base text-muted-foreground leading-relaxed"
                      >
                        {feature.description}
                      </motion.p>
                      {/* Mobile visual */}
                      <div className="mt-5 md:hidden rounded-2xl border border-border bg-card overflow-hidden">
                        {feature.visual}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </BlurFade>
              ))}
            </Accordion>
          </div>

          {/* Right: Visual panel */}
          <div className="relative hidden md:block md:w-1/2">
            <Card className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xs shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {FEATURES[activeIndex].visual}
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
