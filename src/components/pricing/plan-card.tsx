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
    <div className="flex flex-col items-center gap-3">
      {/* Fixed-height label row so all phones start at the same Y */}
      <div className="flex flex-col items-center justify-end gap-1 h-12">
        <span className={cn("text-sm font-bold", plan.accentColor)}>
          {plan.name}
        </span>
        {plan.highlight && (
          <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
            Most Popular
          </Badge>
        )}
      </div>

      {/* All iPhones same fixed width — aspect ratio drives equal height */}
      <div className="w-80">
        <Iphone>
          <PlanScreen plan={plan} billing={billing} />
        </Iphone>
      </div>
    </div>
  );
}
