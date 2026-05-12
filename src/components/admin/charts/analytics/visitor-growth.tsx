"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  visitors: { label: "Visitors", color: "var(--chart-3)" },
} satisfies ChartConfig;

interface Props {
  visitsByDay: { date: string; count: number }[];
  recentStats: { today: number; week: number; month: number };
}

export function VisitorGrowth({ visitsByDay, recentStats }: Props) {
  const chartData = visitsByDay.slice(-14).map((d) => ({
    date: d.date,
    visitors: d.count,
  }));

  const weekTotal = recentStats.week;
  const monthTotal = recentStats.month;
  const avgPerDay =
    chartData.length > 0
      ? Math.round(
          chartData.reduce((sum, d) => sum + d.visitors, 0) / chartData.length,
        )
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Growth</CardTitle>
        <CardDescription>New visitors — last 14 days</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex w-full items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          Avg {avgPerDay} visitors per day
        </div>
        <div className="flex w-full justify-between text-muted-foreground">
          <span>This week: +{weekTotal}</span>
          <span>This month: +{monthTotal}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
