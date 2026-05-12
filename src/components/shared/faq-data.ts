export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// ── Pricing page FAQs — billing, plans, refunds, subscriptions ────────────────
export const PRICING_FAQS: FAQ[] = [
  {
    id: "p-1",
    question: "Can I try Humanly before purchasing?",
    answer:
      "Yes! You can humanize your first 500 words completely free — no credit card required. Just sign up, paste your AI text, and see the results instantly. If you're satisfied, upgrade to a paid plan for unlimited access.",
  },
  {
    id: "p-2",
    question: "What's included in the free plan?",
    answer:
      "The free plan gives you 500 words per month to humanize, access to the basic humanization engine, and AI detection scoring. It's a great way to test the quality before committing to a paid plan.",
  },
  {
    id: "p-3",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. There are no contracts or commitments. You can cancel your subscription at any time from your account settings, and you'll retain access until the end of your current billing period. No questions asked.",
  },
  {
    id: "p-4",
    question: "Do you offer refunds?",
    answer:
      "Yes. If you're not satisfied within the first 7 days of your subscription, contact our support team for a full refund. We want you to be confident in your purchase.",
  },
  {
    id: "p-5",
    question: "What's the difference between monthly and yearly billing?",
    answer:
      "Yearly billing saves you around 20% compared to monthly. You're charged once per year and get all the same features. You can switch between billing cycles at any time from your account settings.",
  },
  {
    id: "p-6",
    question: "What's the difference between the Basic, Pro, and Max plans?",
    answer:
      "Basic is ideal for occasional users — 7,000 words/month with core humanization. Pro unlocks 30,000 words/month, advanced bypass engines, SEO optimization, and priority processing. Max gives you 100,000 words/month plus ultra-human output, priority support, and every feature we offer.",
  },
  {
    id: "p-7",
    question: "How many team seats do I get with the Max plan?",
    answer:
      "The Max plan is designed for power users. For team or enterprise access with multiple seats, contact us for custom pricing tailored to your organization's needs.",
  },
  {
    id: "p-8",
    question: "Do word counts roll over to the next month?",
    answer:
      "No, unused words do not roll over. Your word balance resets at the start of each billing cycle. If you consistently need more words, consider upgrading to the next plan.",
  },
];

// ── Home page FAQs — general product, features, how it works ─────────────────
export const HOME_FAQS: FAQ[] = [
  {
    id: "h-1",
    question: "What is Humanly and how does it work?",
    answer:
      "Humanly is an AI text humanizer that rewrites AI-generated content to sound naturally human. You paste your AI-written text, our engine analyzes and restructures it — adjusting sentence flow, vocabulary, and tone — and returns output that reads like a real person wrote it.",
  },
  {
    id: "h-2",
    question: "How does Humanly bypass AI detectors?",
    answer:
      "Humanly uses advanced natural language processing to eliminate the patterns AI detectors look for — repetitive phrasing, overly formal tone, predictable sentence structure, and statistical word distributions. The result consistently scores as 100% human-written across all major detection tools.",
  },
  {
    id: "h-3",
    question: "Which AI detectors does Humanly bypass?",
    answer:
      "Humanly is tested and verified against all major detectors: GPTZero, Turnitin, Originality.AI, Copyleaks, Winston AI, Sapling, Content at Scale, and ZeroGPT. We continuously update our engine as detectors evolve.",
  },
  {
    id: "h-4",
    question: "Will the humanized text still make sense?",
    answer:
      "Yes. Humanly preserves the meaning, facts, and intent of your original content. We don't just swap words — we restructure sentences intelligently so the output is coherent, accurate, and reads naturally.",
  },
  {
    id: "h-5",
    question: "What types of content can I humanize?",
    answer:
      "Humanly works on any text — essays, blog posts, emails, social media captions, reports, product descriptions, cover letters, and more. If it was written by an AI, Humanly can make it sound human.",
  },
  {
    id: "h-6",
    question: "Can I upload documents instead of pasting text?",
    answer:
      "Yes. Humanly supports direct file uploads in .txt, .pdf, and .docx formats. Just upload your document and we'll process the full content automatically.",
  },
  {
    id: "h-7",
    question: "Is Humanly safe to use for academic work?",
    answer:
      "Humanly is designed to help you refine and polish AI-assisted drafts. You're responsible for ensuring your use complies with your institution's academic integrity policies. We recommend using Humanly as a writing aid to improve quality, not as a replacement for your own thinking.",
  },
  {
    id: "h-8",
    question: "How fast does Humanly process my text?",
    answer:
      "Most texts are processed in under 10 seconds. Pro and Max plan users get priority processing, which is even faster during peak hours. Longer documents may take slightly more time.",
  },
  {
    id: "h-9",
    question: "Does Humanly store my content?",
    answer:
      "We take privacy seriously. Your text is processed in real time and is not stored permanently on our servers. We do not use your content to train our models or share it with third parties.",
  },
  {
    id: "h-10",
    question: "What languages does Humanly support?",
    answer:
      "Humanly currently works best with English content. Support for additional languages including Spanish, French, German, and Portuguese is actively in development and will be available soon.",
  },
];
