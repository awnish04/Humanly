"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
  users: { label: "Users", color: "var(--chart-1)" },
  capacity: { label: "Capacity (k)", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface Props {
  planCounts: { free: number; basic: number; pro: number; max: number };
}

const LIMITS = { free: 0.5, basic: 7, pro: 30, max: 100 };

export function ChartRadarMultiple({ planCounts }: Props) {
  const data = (["free", "basic", "pro", "max"] as const).map((plan) => ({
    plan: plan.charAt(0).toUpperCase() + plan.slice(1),
    users: planCounts[plan],
    capacity: LIMITS[plan],
  }));

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Plan Comparison</CardTitle>
        <CardDescription>Users vs word capacity per plan</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={data}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="plan" />
            <PolarGrid />
            <Radar
              dataKey="users"
              fill="var(--color-users)"
              fillOpacity={0.6}
            />
            <Radar dataKey="capacity" fill="var(--color-capacity)" />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
