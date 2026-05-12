"use client";

import { LabelList, RadialBar, RadialBarChart } from "recharts";
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

interface Props {
  browserCounts: Record<string, number>;
}

export function VisitorBrowserRadial({ browserCounts }: Props) {
  // Build dynamic config and data
  const browsers = Object.entries(browserCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const chartConfig: ChartConfig = {
    visitors: { label: "Visitors" },
    ...Object.fromEntries(
      browsers.map(([browser], idx) => [
        browser.toLowerCase(),
        {
          label: browser,
          color: `var(--chart-${idx + 1})`,
        },
      ]),
    ),
  };

  const chartData = browsers.map(([browser, count]) => ({
    browser: browser.toLowerCase(),
    visitors: count,
    fill: `var(--color-${browser.toLowerCase()})`,
  }));

  const totalVisitors = browsers.reduce((sum, [, count]) => sum + count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Browser Usage</CardTitle>
        <CardDescription>
          {totalVisitors.toLocaleString()} total visitors tracked
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
