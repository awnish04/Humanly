export interface Detector {
  name: string;
  logo: string;
}

export const DETECTORS: Detector[] = [
  { name: "GPTZero", logo: "/GPTZero.jpeg" },
  { name: "Turnitin", logo: "/Turnitin.jpeg" },
  { name: "Originality.AI", logo: "/OriginalityAI.jpeg" },
  { name: "Copyleaks", logo: "/Copyleaks.jpeg" },
  { name: "Winston AI", logo: "/GoWinstonAi.jpeg" },
  { name: "Sapling", logo: "/Sapling.jpeg" },
  { name: "Crossplag", logo: "/CrossplagIcon.jpeg" },
  { name: "ZeroGPT", logo: "/ZeroGPT.jpeg" },
];
