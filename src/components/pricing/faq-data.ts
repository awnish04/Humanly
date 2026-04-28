export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const PRICING_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "How does Humanly bypass AI detectors?",
    answer:
      "Humanly uses advanced natural language processing to rewrite AI-generated text with human-like patterns. We analyze sentence structure, vocabulary choices, and writing flow to eliminate the telltale signs that AI detectors look for — like repetitive phrasing, overly formal tone, and predictable sentence patterns.",
  },
  {
    id: "faq-2",
    question: "Can I try Humanly before purchasing?",
    answer:
      "Yes! You can humanize your first 500 words completely free — no credit card required. Just sign up, paste your AI text, and see the results instantly. If you're satisfied, upgrade to a paid plan for unlimited access.",
  },
  {
    id: "faq-3",
    question: "What AI detectors does Humanly bypass?",
    answer:
      "Humanly bypasses all major AI detection tools including GPTZero, Turnitin, Originality.AI, Copyleaks, Writer.com, Sapling, Content at Scale, and ZeroGPT. Our output consistently scores as 100% human-written across all platforms.",
  },
  {
    id: "faq-4",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. There are no contracts or commitments. You can cancel your subscription at any time from your account settings, and you'll retain access until the end of your current billing period. No questions asked.",
  },
  {
    id: "faq-5",
    question: "What's the difference between the intensity modes?",
    answer:
      "Basic mode makes minimal changes while preserving your original structure. Enhanced mode rewrites more aggressively for better detector bypass. Aggressive mode completely restructures the text for maximum humanization — ideal for heavily AI-flagged content.",
  },
  {
    id: "faq-6",
    question: "Do you offer refunds?",
    answer:
      "Yes. If you're not satisfied within the first 7 days of your subscription, contact our support team for a full refund. We want you to be confident in your purchase.",
  },
  {
    id: "faq-7",
    question: "Can I use Humanly for academic writing?",
    answer:
      "Humanly is designed to help you refine and polish AI-assisted drafts. However, you're responsible for ensuring your use complies with your institution's academic integrity policies. We recommend using Humanly as a writing aid, not a replacement for your own work.",
  },
  {
    id: "faq-8",
    question: "How many team seats do I get with the Business plan?",
    answer:
      "The Business plan includes 5 team seats by default. Each team member gets their own account with full access to all features. Need more seats? Contact us for custom enterprise pricing.",
  },
];
