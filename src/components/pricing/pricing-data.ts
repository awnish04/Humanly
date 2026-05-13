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
    monthlyPrice: 9.99,
    yearlyPrice: 4.99,
    originalMonthlyPrice: 9.99,
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
    monthlyPrice: 19.99,
    yearlyPrice: 14.99,
    originalMonthlyPrice: 19.99,
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
    monthlyPrice: 39.99,
    yearlyPrice: 31.99,
    originalMonthlyPrice: 39.99,
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
