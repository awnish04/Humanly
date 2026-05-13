"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
  clicks: { label: "Clicks", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface ClickPagesRadialProps {
  topPages: Array<{ page: string; count: number }>;
}

export function ClickPagesRadial({ topPages }: ClickPagesRadialProps) {
  const chartData = topPages.slice(0, 5).map((item) => ({
    page: item.page.length > 20 ? item.page.slice(0, 20) + "..." : item.page,
    fullPage: item.page,
    clicks: item.count,
  }));

  const totalClicks = topPages.reduce((sum, p) => sum + p.count, 0);
  const topPage = topPages[0];
  const topPercentage = topPage
    ? ((topPage.count / totalClicks) * 100).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages by Clicks</CardTitle>
        <CardDescription>Most clicked pages</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No page data available yet
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] w-full"
          >
            <RadarChart data={chartData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis dataKey="page" />
              <PolarGrid />
              <Radar
                dataKey="clicks"
                fill="var(--color-clicks)"
                fillOpacity={0.6}
                stroke="var(--color-clicks)"
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
      {chartData.length > 0 && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            <TrendingUp className="h-4 w-4" />
            Top page: {topPage?.page.slice(0, 30) || "N/A"}
          </div>
          <div className="leading-none text-muted-foreground">
            {topPercentage}% of all clicks
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
