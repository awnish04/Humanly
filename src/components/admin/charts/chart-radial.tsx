"use client";

import { RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  words: { label: "Words" },
  free: { label: "Free", color: "var(--chart-4)" },
  basic: { label: "Basic", color: "var(--chart-2)" },
  pro: { label: "Pro", color: "var(--chart-1)" },
  max: { label: "Max", color: "var(--chart-3)" },
} satisfies ChartConfig;

interface Props {
  planCounts: { free: number; basic: number; pro: number; max: number };
  wordsByPlan: { free: number; basic: number; pro: number; max: number };
}

export function ChartRadial({ planCounts, wordsByPlan }: Props) {
  const chartData = (["max", "pro", "basic", "free"] as const).map((plan) => ({
    plan,
    words: wordsByPlan[plan],
    fill: `var(--color-${plan})`,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Word Usage by Plan</CardTitle>
        <CardDescription>Actual words processed per plan tier</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="plan" />}
            />
            <RadialBar dataKey="words" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
