"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
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
  count: { label: "Visits", color: "var(--chart-1)" },
  label: { color: "var(--background)" },
} satisfies ChartConfig;

interface Props {
  topPages: { page: string; count: number }[];
}

export function VisitorTopPages({ topPages }: Props) {
  const chartData = topPages.slice(0, 7).map((p) => ({
    page: p.page,
    count: p.count,
  }));

  const totalVisits = topPages.reduce((sum, p) => sum + p.count, 0);
  const topPage = topPages[0];
  const topPercentage = topPage
    ? ((topPage.count / totalVisits) * 100).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most visited pages across your site</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-sm text-muted-foreground">
            No page data available yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 12, right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="page"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 30)}
                hide
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4}>
                <LabelList
                  dataKey="page"
                  position="insideLeft"
                  offset={8}
                  className="fill-black dark:fill-white"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      {chartData.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            <TrendingUp className="h-4 w-4" />
            Top page: {topPage?.page || "N/A"}
          </div>
          <div className="leading-none text-muted-foreground">
            {topPercentage}% of all visits • {totalVisits.toLocaleString()}{" "}
            total visits
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
