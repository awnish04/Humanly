"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
  words: { label: "Words Used", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface Props {
  data: { plan: string; words: number }[];
}

export function ChartBarHorizontal({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Words by Plan</CardTitle>
        <CardDescription>Total words processed per plan tier</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" dataKey="words" hide />
            <YAxis
              dataKey="plan"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="words" fill="var(--color-words)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
