"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
import { getCountryFlag } from "@/lib/country-flags";

const chartConfig = {
  count: { label: "Visitors", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface Props {
  topCountries: { country: string; countryCode: string; count: number }[];
}

export function VisitorCountriesBar({ topCountries }: Props) {
  const chartData = topCountries.slice(0, 5).map((c) => ({
    country: c.country,
    countryCode: c.countryCode,
    count: c.count,
    flag: getCountryFlag(c.countryCode),
  }));

  const totalVisitors = topCountries.reduce((sum, c) => sum + c.count, 0);
  const topCountry = topCountries[0];
  const topPercentage = topCountry
    ? ((topCountry.count / totalVisitors) * 100).toFixed(1)
    : 0;

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
          <CardDescription>Visitors by location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No country data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Countries</CardTitle>
        <CardDescription>Visitors by location</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="country"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
              tickFormatter={(value, index) => {
                const item = chartData[index];
                return `${item?.flag || ""} ${value}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--chart-2))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          Top country: {topCountry?.country || "N/A"}
        </div>
        <div className="leading-none text-muted-foreground">
          {topPercentage}% of all visitors
        </div>
      </CardFooter>
    </Card>
  );
}
