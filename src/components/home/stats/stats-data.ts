import { TrendingUp, Users, Shield, Zap } from "lucide-react";

export interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  description: string;
}

export const STATS: Stat[] = [
  {
    icon: TrendingUp,
    value: 2.4,
    suffix: "M+",
    decimals: 1,
    label: "Words humanized",
    description: "Millions of words transformed into natural human writing.",
  },
  {
    icon: Users,
    value: 38,
    suffix: "k+",
    decimals: 0,
    label: "Active users",
    description: "Writers, students, and marketers trust Humanly daily.",
  },
  {
    icon: Shield,
    value: 99.1,
    suffix: "%",
    decimals: 1,
    label: "Human score avg",
    description: "Average human score across all major AI detectors.",
  },
  {
    icon: Zap,
    value: 12,
    suffix: "",
    decimals: 0,
    label: "Detectors bypassed",
    description: "Tested and verified against every leading detector tool.",
  },
];
