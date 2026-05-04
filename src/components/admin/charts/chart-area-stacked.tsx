"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  paid: { label: "Paid Users", color: "var(--chart-1)" },
  free: { label: "Free Users", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface Props {
  data: { date: string; paid: number; free: number }[];
}

export function ChartAreaStacked({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth — Stacked</CardTitle>
        <CardDescription>Free vs paid users over last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="free"
              type="natural"
              fill="var(--color-free)"
              fillOpacity={0.4}
              stroke="var(--color-free)"
              stackId="a"
            />
            <Area
              dataKey="paid"
              type="natural"
              fill="var(--color-paid)"
              fillOpacity={0.4}
              stroke="var(--color-paid)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Cumulative daily user counts
        </div>
      </CardFooter>
    </Card>
  );
}
