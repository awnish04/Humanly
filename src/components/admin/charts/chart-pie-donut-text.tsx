"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
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
  users: { label: "Users" },
  free: { label: "Free", color: "var(--chart-4)" },
  basic: { label: "Basic", color: "var(--chart-2)" },
  pro: { label: "Pro", color: "var(--chart-1)" },
  max: { label: "Max", color: "var(--chart-3)" },
} satisfies ChartConfig;

interface Props {
  planCounts: { free: number; basic: number; pro: number; max: number };
}

export function ChartPieDonutText({ planCounts }: Props) {
  const chartData = [
    { plan: "free", users: planCounts.free, fill: "var(--color-free)" },
    { plan: "basic", users: planCounts.basic, fill: "var(--color-basic)" },
    { plan: "pro", users: planCounts.pro, fill: "var(--color-pro)" },
    { plan: "max", users: planCounts.max, fill: "var(--color-max)" },
  ];

  const totalUsers = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.users, 0),
    [planCounts],
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Plan Distribution</CardTitle>
        <CardDescription>Users by subscription plan</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="plan"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
