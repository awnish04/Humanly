"use client";

import { useRef } from "react";
import {
  ClipboardPaste,
  FileText,
  CheckCircle,
  Mail,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Circle } from "./circle-node";
import { HumanlyNode } from "./humanly-node";
import { Card } from "@/components/ui/card";

export function AnimatedDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Input nodes
  const chatgptRef = useRef<HTMLDivElement>(null);
  const geminiRef = useRef<HTMLDivElement>(null);
  const pasteRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);

  // Center
  const humanlyRef = useRef<HTMLDivElement>(null);

  // Output nodes
  const blogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const essayRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div
        ref={containerRef}
        className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden p-8 md:p-12"
      >
        <div className="flex w-full max-w-3xl flex-row items-center justify-between gap-6">
          {/* Inputs column */}
          <div className="flex flex-col justify-center gap-6">
            <Circle
              ref={chatgptRef}
              label="ChatGPT"
              sublabel="AI source"
              className="bg-[#10a37f]/10 border-[#10a37f]/30"
            >
              {/* ChatGPT icon */}
              <svg viewBox="0 0 24 24" className="size-6 fill-[#10a37f]">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.843-3.368L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
              </svg>
            </Circle>

            <Circle
              ref={geminiRef}
              label="Gemini"
              sublabel="AI source"
              className="bg-blue-500/10 border-blue-500/30"
            >
              <svg viewBox="0 0 24 24" className="size-6 fill-blue-500">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2zm0 3a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 7-7 7 7 0 0 0-7-7z" />
              </svg>
            </Circle>

            <Circle
              ref={pasteRef}
              label="Any AI"
              sublabel="Paste text"
              className="bg-primary/10 border-primary/30"
            >
              <ClipboardPaste className="size-6 text-primary" />
            </Circle>

            <Circle
              ref={docsRef}
              label="Document"
              sublabel="Upload file"
              className="bg-orange-500/10 border-orange-500/30"
            >
              <FileText className="size-6 text-orange-500" />
            </Circle>
          </div>

          {/* Center: Humanly engine */}
          <HumanlyNode ref={humanlyRef} />

          {/* Outputs column */}
          <div className="flex flex-col justify-center gap-6">
            <Circle
              ref={blogRef}
              label="Blog Post"
              sublabel="SEO-safe"
              className="bg-primary/10 border-primary/30"
            >
              <BookOpen className="size-6 text-primary" />
            </Circle>

            <Circle
              ref={emailRef}
              label="Email"
              sublabel="Cold outreach"
              className="bg-primary/10 border-primary/30"
            >
              <Mail className="size-6 text-primary" />
            </Circle>

            <Circle
              ref={essayRef}
              label="Essay"
              sublabel="Academic"
              className="bg-primary/10 border-primary/30"
            >
              <CheckCircle className="size-6 text-primary" />
            </Circle>

            <Circle
              ref={socialRef}
              label="Social"
              sublabel="Captions"
              className="bg-primary/10 border-primary/30"
            >
              <MessageSquare className="size-6 text-primary" />
            </Circle>
          </div>
        </div>

        {/* Input beams → Humanly */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={chatgptRef}
          toRef={humanlyRef}
          duration={3}
          curvature={-30}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={geminiRef}
          toRef={humanlyRef}
          duration={3}
          curvature={-10}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={pasteRef}
          toRef={humanlyRef}
          duration={3}
          curvature={10}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={docsRef}
          toRef={humanlyRef}
          duration={3}
          curvature={30}
        />

        {/* Humanly → Output beams */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={humanlyRef}
          toRef={blogRef}
          duration={3}
          curvature={-30}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={humanlyRef}
          toRef={emailRef}
          duration={3}
          curvature={-10}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={humanlyRef}
          toRef={essayRef}
          duration={3}
          curvature={10}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={humanlyRef}
          toRef={socialRef}
          duration={3}
          curvature={30}
        />
      </div>

      {/* Bottom step cards - replacing the simple labels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 border-t border-border bg-muted/30">
        {[
          {
            step: "01",
            title: "Paste your AI text",
            desc: "Drop in content from ChatGPT, Gemini, Claude, or any AI tool.",
          },
          {
            step: "02",
            title: "Humanly rewrites it",
            desc: "Our engine strips AI patterns and rebuilds natural sentence flow.",
          },
          {
            step: "03",
            title: "Copy human output",
            desc: "Passes every detector. Ready to publish, submit, or send.",
          },
        ].map((s, i) => (
          <div key={s.step} className="relative">
            {/* Card */}
            <Card className="flex flex-col gap-3 p-4 h-full">
              <span className="text-2xl font-black text-primary leading-none select-none">
                {s.step}
              </span>

              <h3 className="text-sm font-semibold text-foreground">
                {s.title}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed max-w-none">
                {s.desc}
              </p>
            </Card>

            {/* Arrow (fixed positioning) */}
            {i < 2 && (
              <div className="hidden sm:flex absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20">
                <div className="size-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-sm">
                  <span className="text-primary text-xs">→</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
