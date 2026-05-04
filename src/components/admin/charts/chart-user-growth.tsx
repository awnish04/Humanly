"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const chartConfig = {
  count: { label: "New Users", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface Props {
  signupsByDay: { date: string; count: number }[];
  recentSignups: { today: number; week: number; month: number };
}

export function ChartUserGrowth({ signupsByDay, recentSignups }: Props) {
  // Last 14 days for the bar chart
  const data = signupsByDay.slice(-14);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold">User Growth</CardTitle>
        <CardDescription>New signups — last 14 days</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <ChartContainer config={chartConfig} className="h-36 w-full">
          <BarChart data={data} margin={{ left: -10, right: 0 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9 }}
              minTickGap={20}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tick={{ fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={20}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Summary rows */}
        <div className="flex flex-col gap-0 border-t border-border pt-3">
          {[
            { label: "Today", value: recentSignups.today },
            { label: "This Week", value: recentSignups.week },
            { label: "This Month", value: recentSignups.month },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
            >
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span
                className={
                  row.value > 0
                    ? "text-xs font-bold text-primary"
                    : "text-xs text-muted-foreground"
                }
              >
                {row.value > 0 ? `+${row.value}` : "0"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
