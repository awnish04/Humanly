export interface Plan {
  id: string;
  name: string;
  desc: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlight: boolean;
  accentColor: string;
  bgColor: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    desc: "Best for occasional writers",
    monthlyPrice: 9,
    yearlyPrice: 7,
    highlight: false,
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    features: [
      "500 words / humanization",
      "10 humanizations / month",
      "Basic humanization mode",
      "GPTZero & Turnitin bypass",
      "Copy output instantly",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Best for content creators",
    monthlyPrice: 19,
    yearlyPrice: 15,
    highlight: true,
    accentColor: "text-primary",
    bgColor: "bg-primary/10",
    features: [
      "2,000 words / humanization",
      "Unlimited humanizations",
      "All 3 intensity modes",
      "Bypasses all detectors",
      "Priority processing",
      "AI detection checker",
    ],
  },
  {
    id: "business",
    name: "Business",
    desc: "Best for teams & high volume",
    monthlyPrice: 49,
    yearlyPrice: 39,
    highlight: false,
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    features: [
      "5,000 words / humanization",
      "Unlimited humanizations",
      "All 3 intensity modes",
      "Bypasses all detectors",
      "5 team seats",
      "API access",
      "Priority support",
    ],
  },
];
