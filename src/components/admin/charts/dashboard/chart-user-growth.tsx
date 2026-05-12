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
  count: { label: "New Users", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface Props {
  signupsByDay: { date: string; count: number }[];
  recentSignups: { today: number; week: number; month: number };
}

export function ChartUserGrowth({ signupsByDay, recentSignups }: Props) {
  const data = signupsByDay.slice(-14);
  const totalSignups = data.reduce((sum, d) => sum + d.count, 0);
  const avgPerDay =
    data.length > 0 ? Math.round(totalSignups / data.length) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New signups — last 14 days</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          Avg {avgPerDay} signups per day
        </div>
        <div className="flex w-full justify-between text-muted-foreground">
          <span>This week: +{recentSignups.week}</span>
          <span>This month: +{recentSignups.month}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
