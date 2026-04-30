export interface Plan {
  id: string;
  name: string;
  desc: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalMonthlyPrice?: number;
  highlight: boolean;
  accentColor: string;
  bgColor: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    desc: "7,000 words per month",
    monthlyPrice: 14.99,
    yearlyPrice: 11.99,
    originalMonthlyPrice: 14.99,
    highlight: false,
    accentColor: "text-primary",
    bgColor: "bg-primary/10",
    features: [
      "7,000 words per month",
      "500 words per input",
      "Basic Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "Multiple results",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    desc: "30,000 words per month",
    monthlyPrice: 48.99,
    yearlyPrice: 38.99,
    originalMonthlyPrice: 48.99,
    highlight: true,
    accentColor: "text-primary",
    bgColor: "bg-primary/10",
    features: [
      "30,000 words per month",
      "1,500 words per input",
      "Bypass all AI detectors (incl. Turnitin & GPTZero)",
      "Advanced Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "SEO optimized",
      "Advanced Turnitin Bypass Engine",
      "Human-like results",
      "Unlimited grammar checks",
      "Fast mode",
      "Multiple results",
    ],
  },
  {
    id: "max",
    name: "Max",
    desc: "100,000 words per month",
    monthlyPrice: 98.99,
    yearlyPrice: 78.99,
    originalMonthlyPrice: 98.99,
    highlight: false,
    accentColor: "text-primary",
    bgColor: "bg-violet-400/10",
    features: [
      "100,000 words per month",
      "3,000 words per input",
      "Bypass all AI detectors (incl. Turnitin & GPTZero)",
      "Advanced Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "SEO optimized",
      "Advanced Turnitin Bypass Engine",
      "Human-like results",
      "Unlimited grammar checks",
      "Fast mode",
      "Ultra-human writing output",
      "Priority support",
      "Multiple results",
    ],
  },
];
