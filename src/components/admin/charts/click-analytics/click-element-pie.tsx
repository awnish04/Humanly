"use client";

import { TrendingUp, MousePointerClick } from "lucide-react";
import { Pie, PieChart } from "recharts";
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

interface ClickElementPieProps {
  topElements: Array<{
    element: string;
    count: number;
  }>;
}

export function ClickElementPie({ topElements }: ClickElementPieProps) {
  const sortedElements = topElements.slice(0, 5);

  const chartData = [
    {
      element: sortedElements[0]?.element || "element1",
      clicks: sortedElements[0]?.count || 0,
      fill: "var(--color-element1)",
    },
    {
      element: sortedElements[1]?.element || "element2",
      clicks: sortedElements[1]?.count || 0,
      fill: "var(--color-element2)",
    },
    {
      element: sortedElements[2]?.element || "element3",
      clicks: sortedElements[2]?.count || 0,
      fill: "var(--color-element3)",
    },
    {
      element: sortedElements[3]?.element || "element4",
      clicks: sortedElements[3]?.count || 0,
      fill: "var(--color-element4)",
    },
    {
      element: sortedElements[4]?.element || "element5",
      clicks: sortedElements[4]?.count || 0,
      fill: "var(--color-element5)",
    },
  ].filter((d) => d.clicks > 0);

  const chartConfig = {
    clicks: {
      label: "Clicks",
    },
    element1: {
      label: sortedElements[0]?.element || "Element 1",
      color: "var(--chart-1)",
    },
    element2: {
      label: sortedElements[1]?.element || "Element 2",
      color: "var(--chart-2)",
    },
    element3: {
      label: sortedElements[2]?.element || "Element 3",
      color: "var(--chart-3)",
    },
    element4: {
      label: sortedElements[3]?.element || "Element 4",
      color: "var(--chart-4)",
    },
    element5: {
      label: sortedElements[4]?.element || "Element 5",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  const totalClicks = sortedElements.reduce((sum, item) => sum + item.count, 0);
  const topElement = sortedElements[0]?.element || "N/A";
  const topPercentage = sortedElements[0]
    ? ((sortedElements[0].count / totalClicks) * 100).toFixed(1)
    : 0;

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle className="flex items-center gap-2">
            <MousePointerClick className="size-4" />
            Clicks by Element Type
          </CardTitle>
          <CardDescription>Distribution of clicked elements</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No click data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2">
          <MousePointerClick className="size-4" />
          Clicks by Element Type
        </CardTitle>
        <CardDescription>Distribution of clicked elements</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="clicks"
              nameKey="element"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          Most clicked: {topElement} ({topPercentage}%)
        </div>
        <div className="leading-none text-muted-foreground">
          Total {totalClicks.toLocaleString()} clicks across{" "}
          {sortedElements.length} element types
        </div>
      </CardFooter>
    </Card>
  );
}
