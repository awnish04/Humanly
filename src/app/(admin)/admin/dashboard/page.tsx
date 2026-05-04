"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, FileText, Zap, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChartAreaInteractive } from "@/components/admin/charts/chart-area-interactive";
import { ChartBarInteractive } from "@/components/admin/charts/chart-bar-interactive";
import { ChartPieDonutText } from "@/components/admin/charts/chart-pie-donut-text";
import { ChartRadial } from "@/components/admin/charts/chart-radial";
import { ChartUserGrowth } from "@/components/admin/charts/chart-user-growth";
import { ChartSystemStatus } from "@/components/admin/charts/chart-system-status";

interface AdminStats {
  totalUsers: number;
  paidUsers: number;
  monthlyRevenue: number;
  wordsProcessed: number;
  planDistribution: { free: number; basic: number; pro: number; max: number };
  recentSignups: { today: number; week: number; month: number };
  signupsByDay?: { date: string; count: number }[];
  revenueByDay?: { date: string; amount: number }[];
}

interface HealthData {
  overall: string;
  services: Record<string, { status: "ok" | "error"; latency: number }>;
  checkedAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, healthRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/analytics"),
        fetch("/api/admin/health"),
      ]);
      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();
      const healthData = await healthRes.json();
      setStats({
        ...statsData,
        signupsByDay: analyticsData.signupsByDay,
        revenueByDay: analyticsData.revenueByDay,
      });
      setHealth(healthData);
    } catch {
      setStats({
        totalUsers: 0,
        paidUsers: 0,
        monthlyRevenue: 0,
        wordsProcessed: 0,
        planDistribution: { free: 0, basic: 0, pro: 0, max: 0 },
        recentSignups: { today: 0, week: 0, month: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchAll();
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const areaData = (stats?.signupsByDay ?? []).map((d) => ({
    date: d.date,
    signups: d.count,
    revenue: stats?.revenueByDay?.find((r) => r.date === d.date)?.amount ?? 0,
  }));

  const barData = (stats?.signupsByDay ?? []).map((d) => ({
    date: d.date,
    signups: d.count,
    requests: d.count * 3,
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
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Updated {now}
          </span>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: stats?.totalUsers ?? 0,
              icon: Users,
              color: "bg-sky-400/10 text-sky-400",
              sub: `+${stats?.recentSignups.today ?? 0} today`,
            },
            {
              label: "Monthly Revenue",
              value: `$${((stats?.monthlyRevenue ?? 0) / 100).toFixed(2)}`,
              icon: DollarSign,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "Paid Users",
              value: stats?.paidUsers ?? 0,
              icon: Zap,
              color: "bg-violet-400/10 text-violet-400",
              sub:
                stats && stats.totalUsers > 0
                  ? `${((stats.paidUsers / stats.totalUsers) * 100).toFixed(1)}% conversion`
                  : "—",
            },
            {
              label: "Words Processed",
              value: (stats?.wordsProcessed ?? 0).toLocaleString(),
              icon: FileText,
              color: "bg-yellow-400/10 text-yellow-400",
            },
          ].map((card) => (
            <Card key={card.label} className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    card.color,
                  )}
                >
                  <card.icon className="size-4" />
                </span>
                {card.sub && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {card.sub}
                  </span>
                )}
              </div>
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

        {/* Row 1: Area + Bar interactive charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartAreaInteractive data={areaData} />
          <ChartBarInteractive data={barData} />
        </div>

        {/* Row 2: Donut + Radial + User Growth chart + System Status chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="flex-1 min-w-0">
            <ChartPieDonutText
              planCounts={
                stats?.planDistribution ?? { free: 0, basic: 0, pro: 0, max: 0 }
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <ChartRadial
              planCounts={
                stats?.planDistribution ?? { free: 0, basic: 0, pro: 0, max: 0 }
              }
              totalWords={stats?.wordsProcessed ?? 0}
            />
          </div>
          <div className="flex-1 min-w-0">
            <ChartUserGrowth
              signupsByDay={stats?.signupsByDay ?? []}
              recentSignups={
                stats?.recentSignups ?? { today: 0, week: 0, month: 0 }
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <ChartSystemStatus
              services={
                health?.services ?? {
                  api: { status: "ok", latency: 0 },
                  stripe: { status: "ok", latency: 0 },
                  humanizer: { status: "ok", latency: 0 },
                  clerk: { status: "ok", latency: 0 },
                }
              }
              checkedAt={health?.checkedAt}
            />
          </div>
        </div>
      </main>
    </>
  );
}
