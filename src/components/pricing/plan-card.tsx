import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Iphone } from "@/components/ui/iphone";
import { PlanScreen } from "./plan-screen";
import type { Plan } from "./pricing-data";

interface PlanCardProps {
  plan: Plan;
  billing: "monthly" | "yearly";
}

export function PlanCard({ plan, billing }: PlanCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 transition-all duration-300",
        plan.highlight ? "md:-translate-y-8" : "opacity-90 hover:opacity-100",
      )}
    >
      {/* Label above phone */}
      <div className="flex flex-col items-center gap-1">
        <span className={cn("text-sm font-bold", plan.accentColor)}>
          {plan.name}
        </span>
        {plan.highlight && (
          <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
            Most Popular
          </Badge>
        )}
      </div>

      {/* iPhone IS the card */}
      <div className={cn(plan.highlight ? "w-[21rem]" : "w-[19rem]")}>
        <Iphone>
          <PlanScreen plan={plan} billing={billing} />
        </Iphone>
      </div>
    </div>
  );
}
