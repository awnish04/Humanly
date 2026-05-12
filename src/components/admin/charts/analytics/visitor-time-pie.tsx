"use client";

import { TrendingUp, Clock } from "lucide-react";
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

interface VisitorTimePieProps {
  recentVisitors: Array<{
    page: string;
    timeSpent?: number;
  }>;
}

export function VisitorTimePie({ recentVisitors }: VisitorTimePieProps) {
  // Aggregate time spent by page
  const timeByPage = recentVisitors.reduce(
    (acc, visitor) => {
      if (visitor.timeSpent && visitor.timeSpent > 0) {
        acc[visitor.page] = (acc[visitor.page] || 0) + visitor.timeSpent;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to array and sort by time spent
  const sortedPages = Object.entries(timeByPage)
    .map(([page, time]) => ({ page, time }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  // Simple chart data
  const chartData = [
    {
      page: sortedPages[0]?.page || "page1",
      time: sortedPages[0]?.time || 0,
      fill: "var(--color-page1)",
    },
    {
      page: sortedPages[1]?.page || "page2",
      time: sortedPages[1]?.time || 0,
      fill: "var(--color-page2)",
    },
    {
      page: sortedPages[2]?.page || "page3",
      time: sortedPages[2]?.time || 0,
      fill: "var(--color-page3)",
    },
    {
      page: sortedPages[3]?.page || "page4",
      time: sortedPages[3]?.time || 0,
      fill: "var(--color-page4)",
    },
    {
      page: sortedPages[4]?.page || "page5",
      time: sortedPages[4]?.time || 0,
      fill: "var(--color-page5)",
    },
  ].filter((d) => d.time > 0);

  const chartConfig = {
    time: {
      label: "Time",
    },
    page1: {
      label: sortedPages[0]?.page || "Page 1",
      color: "var(--chart-1)",
    },
    page2: {
      label: sortedPages[1]?.page || "Page 2",
      color: "var(--chart-2)",
    },
    page3: {
      label: sortedPages[2]?.page || "Page 3",
      color: "var(--chart-3)",
    },
    page4: {
      label: sortedPages[3]?.page || "Page 4",
      color: "var(--chart-4)",
    },
    page5: {
      label: sortedPages[4]?.page || "Page 5",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const totalTime = sortedPages.reduce((sum, item) => sum + item.time, 0);
  const avgTime =
    sortedPages.length > 0 ? Math.floor(totalTime / sortedPages.length) : 0;

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="flex items-center gap-2">
            Time Spent by Page
          </CardTitle>
          <CardDescription>
            Total time: {formatTime(totalTime)} across {sortedPages.length}{" "}
            pages
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
            No time tracking data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2">
          Time Spent by Page
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 leading-none font-medium">
            <TrendingUp className="h-4 w-4" />
            Avg {formatTime(avgTime)} per page
          </div>
          Total time: {formatTime(totalTime)} across {sortedPages.length} pages
        </CardDescription>
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
            <Pie data={chartData} dataKey="time" nameKey="page" stroke="0" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
