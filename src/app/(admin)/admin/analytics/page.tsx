"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RefreshCw, Users, TrendingUp, Zap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartAreaStacked } from "@/components/admin/charts/chart-area-stacked";
import { ChartBarMultiple } from "@/components/admin/charts/chart-bar-multiple";
import { ChartBarHorizontal } from "@/components/admin/charts/chart-bar-horizontal";
import { ChartLine } from "@/components/admin/charts/chart-line";
import { ChartPieInteractive } from "@/components/admin/charts/chart-pie-interactive";
import { ChartRadarMultiple } from "@/components/admin/charts/chart-radar-multiple";

interface AnalyticsData {
  signupsByDay: { date: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
  planCounts: { free: number; basic: number; pro: number; max: number };
  totalUsers: number;
  paidUsers: number;
  conversionRate: string;
  totalWordsProcessed: number;
  totalRequests: number;
  avgWordsPerUser: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      setData(json);
    } catch {
      // keep null
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // Derived chart datasets
  const totalPaid = data?.paidUsers ?? 0;
  const totalFree = (data?.totalUsers ?? 0) - totalPaid;

  // Stacked area: cumulative free vs paid per day (approximate from signups)
  const stackedData = (data?.signupsByDay ?? []).map((d) => ({
    date: d.date,
    free: d.count,
    paid: Math.round(
      d.count * (totalPaid / Math.max(data?.totalUsers ?? 1, 1)),
    ),
  }));

  // Bar multiple: signups vs paid conversions
  const barMultipleData = (data?.signupsByDay ?? []).map((d) => ({
    date: d.date,
    signups: d.count,
    paid: Math.round(
      d.count * (totalPaid / Math.max(data?.totalUsers ?? 1, 1)),
    ),
  }));

  // Horizontal bar: words by plan
  const LIMITS = { free: 500, basic: 7000, pro: 30000, max: 100000 };
  const horizontalData = (["free", "basic", "pro", "max"] as const).map(
    (plan) => ({
      plan,
      words: (data?.planCounts[plan] ?? 0) * LIMITS[plan],
    }),
  );

  // Line chart: conversion rate over time (approximate)
  const lineData = (data?.signupsByDay ?? []).map((d) => ({
    date: d.date,
    rate: parseFloat(data?.conversionRate ?? "0"),
  }));

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            User growth, revenue, and usage metrics — last 30 days.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: data?.totalUsers ?? 0,
              icon: Users,
              color: "bg-sky-400/10 text-sky-400",
            },
            {
              label: "Conversion Rate",
              value: `${data?.conversionRate ?? "0.0"}%`,
              icon: TrendingUp,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "Words Processed",
              value: (data?.totalWordsProcessed ?? 0).toLocaleString(),
              icon: FileText,
              color: "bg-yellow-400/10 text-yellow-400",
            },
            {
              label: "Avg Words / User",
              value: (data?.avgWordsPerUser ?? 0).toLocaleString(),
              icon: Zap,
              color: "bg-violet-400/10 text-violet-400",
            },
          ].map((card) => (
            <Card key={card.label} className="p-5 flex flex-col gap-3">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl",
                  card.color,
                )}
              >
                <card.icon className="size-4" />
              </span>
              <div>
                <p className="text-2xl font-black text-foreground">
                  {card.value}
                </p>
                <p className="text-xs mt-0.5 text-muted-foreground">
                  {card.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartAreaStacked data={stackedData} />
          <ChartBarMultiple data={barMultipleData} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartBarHorizontal data={horizontalData} />
          <ChartLine data={lineData} />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPieInteractive
            planCounts={
              data?.planCounts ?? { free: 0, basic: 0, pro: 0, max: 0 }
            }
          />
          <ChartRadarMultiple
            planCounts={
              data?.planCounts ?? { free: 0, basic: 0, pro: 0, max: 0 }
            }
          />
        </div>
      </main>
    </>
  );
}
