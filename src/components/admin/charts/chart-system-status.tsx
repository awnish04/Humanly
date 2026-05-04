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
import { cn } from "@/lib/utils";

const chartConfig = {
  latency: { label: "Latency (ms)", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface ServiceHealth {
  status: "ok" | "error";
  latency: number;
}

interface Props {
  services: Record<string, ServiceHealth>;
  checkedAt?: string;
}

const SERVICE_LABELS: Record<string, string> = {
  api: "API",
  stripe: "Stripe",
  humanizer: "Humanizer",
  clerk: "Auth (Clerk)",
};

export function ChartSystemStatus({ services, checkedAt }: Props) {
  const chartData = Object.entries(services).map(([key, val]) => ({
    service: SERVICE_LABELS[key] ?? key,
    latency: val.latency,
    status: val.status,
  }));

  const allOk = Object.values(services).every((s) => s.status === "ok");

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold">System Status</CardTitle>
            <CardDescription>
              {checkedAt
                ? `Checked at ${new Date(checkedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                : "Live health check"}
            </CardDescription>
          </div>
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border",
              allOk
                ? "text-primary bg-primary/10 border-primary/20"
                : "text-destructive bg-destructive/10 border-destructive/20",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                allOk ? "bg-primary animate-pulse" : "bg-destructive",
              )}
            />
            {allOk ? "All systems OK" : "Degraded"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        {/* Latency bar chart */}
        <ChartContainer config={chartConfig} className="h-28 w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 8 }}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              type="number"
              dataKey="latency"
              tick={{ fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}ms`}
            />
            <YAxis
              type="category"
              dataKey="service"
              tick={{ fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent formatter={(v) => [`${v}ms`, "Latency"]} />
              }
            />
            <Bar
              dataKey="latency"
              radius={[0, 4, 4, 0]}
              fill="var(--color-latency)"
            />
          </BarChart>
        </ChartContainer>

        {/* Status rows */}
        <div className="flex flex-col gap-0 border-t border-border pt-3">
          {chartData.map((item) => (
            <div
              key={item.service}
              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
            >
              <span className="text-xs text-muted-foreground">
                {item.service}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {item.latency}ms
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    item.status === "ok" ? "text-primary" : "text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      item.status === "ok" ? "bg-primary" : "bg-destructive",
                    )}
                  />
                  {item.status === "ok" ? "OK" : "Error"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
