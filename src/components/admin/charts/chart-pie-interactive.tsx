"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export function ChartPieInteractive({ planCounts }: Props) {
  const id = "pie-plan-interactive";
  const plans = ["free", "basic", "pro", "max"] as const;
  const [activePlan, setActivePlan] = React.useState<string>("pro");

  const chartData = plans.map((plan) => ({
    plan,
    users: planCounts[plan],
    fill: `var(--color-${plan})`,
  }));

  const activeIndex = chartData.findIndex((d) => d.plan === activePlan);

  const renderShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 10} />
            <Sector
              {...props}
              outerRadius={outerRadius + 25}
              innerRadius={outerRadius + 12}
            />
          </g>
        );
      }
      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Plan Breakdown</CardTitle>
          <CardDescription>Click a plan to highlight</CardDescription>
        </div>
        <Select value={activePlan} onValueChange={(v) => v && setActivePlan(v)}>
          <SelectTrigger
            className="ml-auto h-7 w-[120px] rounded-lg pl-2.5"
            aria-label="Select plan"
          >
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {plans.map((plan) => (
              <SelectItem
                key={plan}
                value={plan}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs capitalize">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{ backgroundColor: `var(--color-${plan})` }}
                  />
                  {plan}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
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
              shape={renderShape}
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
                          {chartData[activeIndex]?.users.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground capitalize"
                        >
                          {activePlan}
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
