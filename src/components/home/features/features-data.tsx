import { VisualAcademicFlow } from "./visual-academic-flow";
import { VisualBypassFlow } from "./visual-bypass-flow";
import { VisualDetectionFlow } from "./visual-detection-flow";
import { VisualSEOFlow } from "./visual-seo-flow";


export interface Feature {
  id: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}

export const FEATURES: Feature[] = [
  {
    id: "humanize",
    title: "Instant AI Humanization",
    description:
      "Paste any AI-generated text and get natural, human-sounding output in seconds. Humanly rewrites robotic phrasing while preserving your original meaning and intent.",
    visual: <VisualDetectionFlow />,
  },
  {
    id: "bypass",
    title: "Bypass Every AI Detector",
    description:
      "Tested and proven against Turnitin, GPTZero, ZeroGPT, Originality.ai, and more. Our advanced rewriting engine ensures your content passes every major detection tool.",
    visual: <VisualBypassFlow />,
  },
  {
    id: "academic",
    title: "Academic & Professional Writing",
    description:
      "Submit essays, research papers, and reports with confidence. Humanly preserves your voice and argument structure while removing all AI detection signals.",
    visual: <VisualAcademicFlow />,
  },
  {
    id: "seo",
    title: "SEO-Safe Content at Scale",
    description:
      "Create blog posts, product descriptions, and landing pages that rank on Google — without the risk of AI content penalties. Human-sounding copy that converts.",
    visual: <VisualSEOFlow />,
  },
];
