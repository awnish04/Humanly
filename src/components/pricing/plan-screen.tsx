import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Separator } from "@/components/ui/separator";
import type { Plan } from "./pricing-data";

interface PlanScreenProps {
  plan: Plan;
  billing: "monthly" | "yearly";
}

export function PlanScreen({ plan, billing }: PlanScreenProps) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <div className="h-full w-full bg-background flex flex-col overflow-hidden px-5 pt-18 pb-5 gap-3">
      {/* Plan name + desc */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <h3>{plan.name}</h3>
        <p className="text-sm text-muted-foreground leading-tight">
          {plan.desc}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 leading-none shrink-0">
        <h3 className={cn("self-start mt-1", plan.accentColor)}>$</h3>
        <h1 className={cn("tabular-nums leading-none", plan.accentColor)}>
          <NumberTicker value={price} />
        </h1>
        <p className="mb-2">/mo</p>
      </div>

      <Separator className="my-2" />

      {/* Features */}
      <ul className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className={cn("size-4 mt-0.5 shrink-0", plan.accentColor)} />
            <span className="text-sm text-foreground/80 leading-tight">
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={cn(
          "w-full py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all",
          plan.highlight
            ? "bg-primary text-primary-foreground"
            : "border border-border text-foreground",
        )}
      >
        Get Started
      </button>
    </div>
  );
}
