export interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  readTime: string;
}

export const POSTS: Post[] = [
  {
    id: "post-1",
    title: "How to Make ChatGPT Text Undetectable in 2024",
    summary:
      "AI detectors are getting smarter — but so are humanization tools. Here's a step-by-step guide to making your ChatGPT output pass every major detector without losing quality.",
    label: "Tutorial",
    author: "Sarah Chen",
    published: "12 Jan 2024",
    url: "/blog/make-chatgpt-undetectable",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800&h=450",
    readTime: "5 min read",
  },
  {
    id: "post-2",
    title: "GPTZero vs Turnitin: Which AI Detector is Harder to Beat?",
    summary:
      "We ran 500 AI-generated samples through both detectors and analyzed the results. The findings might surprise you — and change how you approach humanization.",
    label: "Research",
    author: "Marcus Webb",
    published: "8 Jan 2024",
    url: "/blog/gptzero-vs-turnitin",
    image:
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800&h=450",
    readTime: "8 min read",
  },
  {
    id: "post-3",
    title: "The Science Behind AI Writing Patterns",
    summary:
      "Why do AI detectors work? We break down the linguistic fingerprints that give AI text away — and explain exactly how Humanly eliminates them.",
    label: "Deep Dive",
    author: "Priya Nair",
    published: "3 Jan 2024",
    url: "/blog/ai-writing-patterns",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800&h=450",
    readTime: "10 min read",
  },
  {
    id: "post-4",
    title: "5 Ways to Use AI for Content Marketing Without Getting Flagged",
    summary:
      "Content marketers are embracing AI — but detection risks are real. Here are five proven strategies to scale your content production while keeping everything undetectable.",
    label: "Strategy",
    author: "James Okafor",
    published: "28 Dec 2023",
    url: "/blog/ai-content-marketing",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=450",
    readTime: "6 min read",
  },
  {
    id: "post-5",
    title: "Academic Writing with AI: What's Allowed and What Isn't",
    summary:
      "Universities are updating their AI policies fast. We surveyed 50 institutions to map out what's acceptable — and how students can use AI tools responsibly.",
    label: "Academic",
    author: "Yuki Tanaka",
    published: "20 Dec 2023",
    url: "/blog/academic-ai-writing",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800&h=450",
    readTime: "7 min read",
  },
  {
    id: "post-6",
    title: "How SEO Agencies Are Using AI Without Losing Rankings",
    summary:
      "Google's helpful content update changed everything. Here's how top SEO agencies are using AI-assisted writing while maintaining their search rankings.",
    label: "SEO",
    author: "Tom Briggs",
    published: "15 Dec 2023",
    url: "/blog/seo-ai-writing",
    image:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800&h=450",
    readTime: "9 min read",
  },
];
