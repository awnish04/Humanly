"use client";

/**
 * Admin Analytics Dashboard with Visitor Tracking Charts
 * Uses the same chart components as the dashboard
 */

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Eye,
  Globe,
  MapPin,
  Clock,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import type { VisitorStats } from "@/lib/visitor-tracking";
import { cn } from "@/lib/utils";
import { getCountryFlag } from "@/lib/country-flags";
import { VisitorTrafficArea } from "@/components/admin/charts/analytics/visitor-traffic-area";
import { VisitorBarInteractive } from "@/components/admin/charts/analytics/visitor-bar-interactive";
import { VisitorDevicePie } from "@/components/admin/charts/analytics/visitor-device-pie";
import { VisitorBrowserRadial } from "@/components/admin/charts/analytics/visitor-browser-radial";
import { VisitorGrowth } from "@/components/admin/charts/analytics/visitor-growth";
import { VisitorTopPages } from "@/components/admin/charts/analytics/visitor-top-pages";
import { VisitorTimePie } from "@/components/admin/charts/analytics/visitor-time-pie";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const response = await fetch(`/api/visitor-stats?days=${timeRange}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        if (!cancelled) {
          setStats(data);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        if (!cancelled)
          setStats({
            totalVisitors: 0,
            uniqueVisitors: 0,
            pageViews: 0,
            countries: 0,
            topCountries: [],
            topPages: [],
            topDevices: [],
            topBrowsers: [],
            recentVisitors: [],
            dailyVisits: [],
            returningVisitors: 0,
            newVisitors: 0,
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

  const chartData = useMemo(() => {
    if (!stats) return null;

    // Prepare data for charts
    const trafficData = stats.dailyVisits.map((day) => {
      const dayVisitors = stats.recentVisitors.filter(
        (v) => new Date(v.timestamp).toISOString().split("T")[0] === day.date,
      );
      const mobile = dayVisitors.filter((v) => v.device === "mobile").length;
      const desktop = dayVisitors.filter((v) => v.device === "desktop").length;

      return {
        date: day.date,
        mobile: mobile || Math.floor(day.visits * 0.4),
        desktop: desktop || Math.floor(day.visits * 0.6),
      };
    });

    const barData = stats.dailyVisits.map((day) => ({
      date: day.date,
      visits: day.visits,
      pageviews: Math.floor(day.visits * 1.5), // Estimate
    }));

    const deviceCounts = {
      desktop: stats.topDevices.find((d) => d.device === "desktop")?.count || 0,
      mobile: stats.topDevices.find((d) => d.device === "mobile")?.count || 0,
      tablet: stats.topDevices.find((d) => d.device === "tablet")?.count || 0,
    };

    const browserCounts = Object.fromEntries(
      stats.topBrowsers.map((b) => [b.browser, b.count]),
    );

    const visitsByDay = stats.dailyVisits.map((d) => ({
      date: d.date,
      count: d.visits,
    }));

    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const monthAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const recentStats = {
      today: stats.dailyVisits.find((d) => d.date === today)?.visits || 0,
      week: stats.dailyVisits
        .filter((d) => d.date >= weekAgo)
        .reduce((sum, d) => sum + d.visits, 0),
      month: stats.dailyVisits
        .filter((d) => d.date >= monthAgo)
        .reduce((sum, d) => sum + d.visits, 0),
    };

    return {
      trafficData,
      barData,
      deviceCounts,
      browserCounts,
      visitsByDay,
      recentStats,
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats || !chartData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">
          Failed to load analytics
        </p>
      </div>
    );
  }

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

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold">Visitor Activity</h1>
        </div>
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
            Visitor Activity
          </h1>
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Visitors",
              value: stats.totalVisitors,
              icon: Users,
              color: "bg-sky-400/10 text-sky-400",
              sub: `${Math.round((stats.newVisitors / (stats.totalVisitors || 1)) * 100)}% new`,
            },
            {
              label: "Unique Visitors",
              value: stats.uniqueVisitors,
              icon: Eye,
              color: "bg-primary/10 text-primary",
            },
            {
              label: "Page Views",
              value: stats.pageViews,
              icon: Globe,
              color: "bg-violet-400/10 text-violet-400",
              sub: `${(stats.pageViews / (stats.uniqueVisitors || 1)).toFixed(1)} per user`,
            },
            {
              label: "Countries",
              value: stats.countries,
              icon: MapPin,
              color: "bg-yellow-400/10 text-yellow-400",
            },
            {
              label: "Avg Time Spent",
              value: (() => {
                const totalTime = stats.recentVisitors.reduce(
                  (sum, v) => sum + (v.timeSpent || 0),
                  0,
                );
                const avgSeconds =
                  stats.recentVisitors.length > 0
                    ? Math.floor(totalTime / stats.recentVisitors.length)
                    : 0;
                const minutes = Math.floor(avgSeconds / 60);
                const seconds = avgSeconds % 60;
                return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
              })(),
              icon: Clock,
              color: "bg-emerald-400/10 text-emerald-400",
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

        {/* Row 1: Full-width charts */}
        <div className="flex flex-col gap-6 mb-6">
          <VisitorTrafficArea data={chartData.trafficData} />
          <VisitorBarInteractive data={chartData.barData} />
        </div>

        {/* Row 2: Grid charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="flex-1 min-w-0">
            <VisitorDevicePie deviceCounts={chartData.deviceCounts} />
          </div>
          <div className="flex-1 min-w-0">
            <VisitorBrowserRadial browserCounts={chartData.browserCounts} />
          </div>
          <div className="flex-1 min-w-0">
            <VisitorGrowth
              visitsByDay={chartData.visitsByDay}
              recentStats={chartData.recentStats}
            />
          </div>
          <div className="flex-1 min-w-0">
            <VisitorTimePie recentVisitors={stats.recentVisitors} />
          </div>
        </div>

        {/* Row 3: Full width chart */}
        <div className="mb-6">
          <VisitorTopPages topPages={stats.topPages} />
        </div>

        {/* Recent Visitors Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Visitors</CardTitle>
                <CardDescription>Live visitor activity feed</CardDescription>
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
                      Time
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Location
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Device
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Browser
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Page
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Time Spent
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVisitors.slice(0, 20).map((visitor) => (
                    <tr
                      key={visitor.visitId}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {new Date(visitor.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getCountryFlag(visitor.countryCode)}
                          </span>
                          <span className="text-xs text-foreground">
                            {visitor.city}, {visitor.countryCode}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {deviceIcon(visitor.device)}
                          <span className="text-xs text-foreground capitalize">
                            {visitor.device}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs text-foreground">
                          {visitor.browser}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <code className="text-xs text-muted-foreground font-mono">
                          {visitor.page}
                        </code>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs text-foreground">
                          {visitor.timeSpent
                            ? `${Math.floor(visitor.timeSpent / 60)}m ${visitor.timeSpent % 60}s`
                            : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={visitor.isNewVisitor ? "default" : "outline"}
                          className="text-xs"
                        >
                          {visitor.isNewVisitor ? "New" : "Returning"}
                        </Badge>
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
