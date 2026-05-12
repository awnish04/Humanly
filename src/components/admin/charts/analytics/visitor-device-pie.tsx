"use client";

import { Pie, PieChart } from "recharts";
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
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  tablet: { label: "Tablet", color: "var(--chart-3)" },
} satisfies ChartConfig;

interface Props {
  deviceCounts: { desktop: number; mobile: number; tablet: number };
}

export function VisitorDevicePie({ deviceCounts }: Props) {
  const total =
    deviceCounts.desktop + deviceCounts.mobile + deviceCounts.tablet;

  const chartData = [
    {
      device: "desktop",
      visitors: deviceCounts.desktop,
      fill: "var(--color-desktop)",
    },
    {
      device: "mobile",
      visitors: deviceCounts.mobile,
      fill: "var(--color-mobile)",
    },
    {
      device: "tablet",
      visitors: deviceCounts.tablet,
      fill: "var(--color-tablet)",
    },
  ].filter((d) => d.visitors > 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Device Distribution</CardTitle>
        <CardDescription>Users by device type</CardDescription>
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
              dataKey="visitors"
              nameKey="device"
              innerRadius={60}
              strokeWidth={5}
            >
              {/* Label in center */}
            </Pie>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-3xl font-bold"
            >
              {total}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
            >
              Visitors
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
