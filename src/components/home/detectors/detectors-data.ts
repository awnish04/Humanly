export interface Detector {
  name: string;
  score: string;
  status: "passed" | "bypassed";
  logo?: string;
}

export const DETECTORS: Detector[] = [
  {
    name: "GPTZero",
    score: "0% AI",
    status: "bypassed",
  },
  {
    name: "Turnitin",
    score: "100% Human",
    status: "bypassed",
  },
  {
    name: "Originality.AI",
    score: "0% AI",
    status: "bypassed",
  },
  {
    name: "Copyleaks",
    score: "Human Written",
    status: "bypassed",
  },
  {
    name: "Writer.com",
    score: "0% AI",
    status: "bypassed",
  },
  {
    name: "Sapling",
    score: "Human Content",
    status: "bypassed",
  },
  {
    name: "Content at Scale",
    score: "100% Human",
    status: "bypassed",
  },
  {
    name: "ZeroGPT",
    score: "0% AI",
    status: "bypassed",
  },
];
