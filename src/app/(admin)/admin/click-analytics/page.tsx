"use client";

/**
 * Admin Click Analytics Dashboard
 * Tracks and visualizes user click events
 */

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MousePointerClick,
  Clock,
  RefreshCw,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getCountryFlag } from "@/lib/country-flags";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ClickElementPie } from "@/components/admin/charts/click-analytics/click-element-pie";
import { ClickDailyArea } from "@/components/admin/charts/click-analytics/click-daily-area";
import { ClickPagesRadial } from "@/components/admin/charts/click-analytics/click-pages-radial";
import { ClickElementsBar } from "@/components/admin/charts/click-analytics/click-elements-bar";

interface ClickStats {
  totalClicks: number;
  dailyClicks: Array<{ date: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
  topElements: Array<{ element: string; count: number }>;
  recentClicks: Array<{
    id: string;
    page: string;
    elementType: string;
    elementText: string;
    elementId?: string;
    elementClass?: string;
    xPosition: number;
    yPosition: number;
    timestamp: number;
    country: string;
    countryCode: string;
    device: string;
    os: string;
    browser: string;
  }>;
}

export default function ClickAnalyticsPage() {
  const [stats, setStats] = useState<ClickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const response = await fetch(`/api/click-stats?days=${timeRange}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        if (!cancelled) {
          setStats(data);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error("Failed to fetch click stats:", error);
        if (!cancelled)
          setStats({
            totalClicks: 0,
            dailyClicks: [],
            topPages: [],
            topElements: [],
            recentClicks: [],
          });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    const interval = autoRefresh ? setInterval(run, 30000) : null;

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [timeRange, autoRefresh]);

  const now = lastUpdated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const deviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="size-4" />;
      case "tablet":
        return <Tablet className="size-4" />;
      default:
        return <Monitor className="size-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading click analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">
          Failed to load click analytics
        </p>
      </div>
    );
  }

  const avgClicksPerDay =
    stats.dailyClicks.length > 0
      ? Math.round(
          stats.dailyClicks.reduce((sum, d) => sum + d.count, 0) /
            stats.dailyClicks.length,
        )
      : 0;

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-full"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Click Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Updated {now}
          </span>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days as 7 | 30 | 90)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  timeRange === days
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {days}d
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setAutoRefresh(false);
              setTimeout(() => setAutoRefresh(true), 0);
            }}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
          >
            <RefreshCw
              className={cn(
                "size-3.5",
                (autoRefresh || loading) && "animate-spin",
              )}
            />
            Refresh
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Click Analytics
          </h1>
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Clicks",
              value: stats.totalClicks,
              icon: MousePointerClick,
              color: "bg-sky-400/10 text-sky-400",
            },
            {
              label: "Avg Clicks/Day",
              value: avgClicksPerDay,
              icon: Clock,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "Pages Tracked",
              value: stats.topPages.length,
              icon: Globe,
              color: "bg-violet-400/10 text-violet-400",
            },
            {
              label: "Element Types",
              value: stats.topElements.length,
              icon: MapPin,
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
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString()
                    : card.value}
                </p>
                <p className="text-xs mt-0.5 text-muted-foreground">
                  {card.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Clicks Area Chart */}
          <ClickDailyArea dailyClicks={stats.dailyClicks} />

          {/* Element Type Pie Chart */}
          <ClickElementPie topElements={stats.topElements} />

          {/* Top Pages Radar Chart */}
          <ClickPagesRadial topPages={stats.topPages} />

          {/* Top Elements Bar Chart */}
          <ClickElementsBar topElements={stats.topElements} />
        </div>

        {/* Recent Clicks Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Clicks</CardTitle>
                <CardDescription>Live click activity feed</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Date & Time
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Page
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Element
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Text
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Position
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Location
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Device
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      OS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentClicks.slice(0, 20).map((click) => (
                    <tr
                      key={click.id}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                            <Clock className="size-3" />
                            {new Date(click.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground pl-5">
                            {new Date(click.timestamp).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <code className="text-xs text-foreground font-mono">
                          {click.page.length > 20
                            ? click.page.slice(0, 20) + "..."
                            : click.page}
                        </code>
                      </td>
                      <td className="py-3 px-2">
                        <code className="text-xs text-primary font-mono">
                          {click.elementType}
                        </code>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs text-foreground">
                          {click.elementText.length > 30
                            ? click.elementText.slice(0, 30) + "..."
                            : click.elementText || "-"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          {click.xPosition},{click.yPosition}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getCountryFlag(click.countryCode)}
                          </span>
                          <span className="text-xs text-foreground">
                            {click.countryCode}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center">
                          {deviceIcon(click.device)}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs text-foreground">
                          {click.os || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
