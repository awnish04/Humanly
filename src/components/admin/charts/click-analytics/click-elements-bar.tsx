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
  clicks: {
    label: "Clicks",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface ClickElementsBarProps {
  topElements: Array<{ element: string; count: number }>;
}

export function ClickElementsBar({ topElements }: ClickElementsBarProps) {
  const chartData = topElements.slice(0, 5).map((item) => ({
    element: item.element,
    clicks: item.count,
  }));

  const totalClicks = topElements.reduce((sum, e) => sum + e.count, 0);
  const topElement = topElements[0];
  const topPercentage = topElement
    ? ((topElement.count / totalClicks) * 100).toFixed(1)
    : 0;

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Element Types</CardTitle>
          <CardDescription>Most clicked element types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No element data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Element Types</CardTitle>
        <CardDescription>Most clicked element types</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="element"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="clicks" fill="var(--color-clicks)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          Most clicked: &lt;{topElement?.element || "N/A"}&gt;
        </div>
        <div className="leading-none text-muted-foreground">
          {topPercentage}% of all clicks
        </div>
      </CardFooter>
    </Card>
  );
}
