"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  signups: { label: "New Users", color: "var(--chart-1)" },
  paid: { label: "Conversions", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface Props {
  data: { date: string; signups: number; paid: number }[];
}

export function ChartBarMultiple({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signups vs Conversions</CardTitle>
        <CardDescription>New users vs paid conversions per day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
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
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="signups" fill="var(--color-signups)" radius={4} />
            <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
