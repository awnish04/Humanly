"use client";

import { useState, useEffect, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Rocket, Gift, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Discount {
  id: string;
  code: string;
  percentage: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  enabled: boolean;
  showTimer: boolean;
  timerMinutes: number;
  delaySeconds: number;
  expiresAt?: string;
}

const QUERY = `query { discounts { id code percentage title description ctaText ctaLink enabled showTimer timerMinutes delaySeconds expiresAt } }`;

const FEATURES = [
  "Unlimited words per month",
  "Advanced AI bypass technology",
  "Priority processing speed",
  "Premium support",
];

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export function DiscountPopup() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(0);
  const [, startTransition] = useTransition();

  // Fetch active discounts
  useEffect(() => {
    if (!isLoaded || isSignedIn || isAdmin) return;

    fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: QUERY }),
    })
      .then((r) => r.json())
      .then((json) => {
        const all = (json?.data?.discounts ?? []) as Discount[];
        const active = all.filter((d) => d.enabled);
        if (!active.length) return;
        setDiscounts(active);

        // Show after 2 second delay
        const t = setTimeout(() => {
          startTransition(() => setOpen(true));
        }, 2000);
        return () => clearTimeout(t);
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn, isAdmin]);

  // Set timer when current discount changes
  useEffect(() => {
    const d = discounts[current];
    if (!d) return;
    startTransition(() => {
      if (d.expiresAt) {
        setTimer(
          Math.max(
            0,
            Math.floor((new Date(d.expiresAt).getTime() - Date.now()) / 1000),
          ),
        );
      } else {
        setTimer(d.timerMinutes * 60);
      }
    });
  }, [current, discounts]);

  // Countdown tick
  useEffect(() => {
    if (!open || !discounts[current]?.showTimer) return;
    const iv = setInterval(() => {
      setTimer((prev) => {
        if (discounts[current]?.expiresAt) {
          return Math.max(
            0,
            Math.floor(
              (new Date(discounts[current].expiresAt!).getTime() - Date.now()) /
                1000,
            ),
          );
        }
        return Math.max(0, prev - 1);
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [open, current, discounts]);

  if (!isLoaded || isSignedIn || isAdmin || !discounts.length) return null;

  const d = discounts[current];
  if (!d) return null;

  const handleClaim = () => {
    navigator.clipboard?.writeText(d.code).catch(() => {});
    window.location.href = d.ctaLink ?? "/pricing";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm w-full p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* Header gradient accent */}
        <div className=" px-6 pt-6 pb-4">
          <DialogHeader className="items-center text-center space-y-3">
            {/* Special offer badge */}
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              <Gift className="size-3" aria-hidden="true" />
              SPECIAL OFFER
            </Badge>

            <DialogTitle className="text-2xl font-black text-foreground leading-tight">
              {d.title}
            </DialogTitle>

            <p className="text-sm font-semibold text-primary">
              {d.description}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Coupon code box */}
          <div className="rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 py-4 text-center">
            <code className="text-3xl font-black text-primary tracking-widest select-all block">
              {d.code}
            </code>
            <p className="text-sm font-semibold text-orange-500 mt-1">
              Get {d.percentage}% OFF Today
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-2">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Check
                  className="size-4 text-foreground shrink-0"
                  aria-hidden="true"
                />
                {f}
              </li>
            ))}
          </ul>

          {/* Timer */}
          {d.showTimer && timer > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <span>⏱ Expires in</span>
              <span className="font-mono font-bold text-orange-500">
                {fmt(timer)}
              </span>
            </div>
          )}

          {/* CTA */}
          <Button
            size="lg"
            className="w-full h-12 text-base font-bold rounded-xl gap-2"
            onClick={handleClaim}
          >
            <Rocket className="size-4" aria-hidden="true" />
            {d.ctaText} & Save {d.percentage}%
          </Button>

          {/* Multiple discounts navigation */}
          {discounts.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              {discounts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`size-2 rounded-full transition-all ${
                    i === current ? "bg-primary w-4" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Offer ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Maybe later */}
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
