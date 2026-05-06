"use client";

import { useEffect, useState } from "react";
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
import { RefreshCw } from "lucide-react";
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
  conversionsByDay: { date: string; count: number }[];
  stackedByDay: { date: string; free: number; paid: number }[];
  conversionByDay: { date: string; rate: number }[];
  wordsByPlan: { free: number; basic: number; pro: number; max: number };
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

  // All real data from API — no approximations
  const stackedData = data?.stackedByDay ?? [];
  const barMultipleData = (data?.signupsByDay ?? []).map((d, i) => ({
    date: d.date,
    signups: d.count,
    paid: data?.conversionsByDay?.[i]?.count ?? 0,
  }));
  const horizontalData = (["free", "basic", "pro", "max"] as const).map(
    (plan) => ({
      plan,
      words: data?.wordsByPlan?.[plan] ?? 0,
    }),
  );
  const lineData = data?.conversionByDay ?? [];

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

        {/* Full-width charts */}
        <div className="flex flex-col gap-6 mb-6">
          <ChartAreaStacked data={stackedData} />
          <ChartBarMultiple data={barMultipleData} />
        </div>

        {/* Row 2 — half width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartBarHorizontal data={horizontalData} />
          <ChartLine data={lineData} />
        </div>

        {/* Row 3 — half width */}
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
            wordsByPlan={
              data?.wordsByPlan ?? { free: 0, basic: 0, pro: 0, max: 0 }
            }
          />
        </div>
      </main>
    </>
  );
}
