import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileText, Zap, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await currentUser();
  const name = user?.firstName ?? "there";

  return (
    <main className="pt-28 section">
      <div className="container-page flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">
            Welcome back, {name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your Humanly usage.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Words Humanized",
              value: "0",
              icon: FileText,
              color: "text-primary",
            },
            {
              label: "Documents",
              value: "0",
              icon: FileText,
              color: "text-sky-400",
            },
            {
              label: "Words Remaining",
              value: "500",
              icon: Zap,
              color: "text-primary",
            },
            {
              label: "Avg. Score",
              value: "—",
              icon: TrendingUp,
              color: "text-violet-400",
            },
          ].map((stat) => (
            <Card key={stat.label} className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
              <p className="text-3xl font-black text-foreground">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/">
              <Button>Humanize Text</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">Upgrade Plan</Button>
            </Link>
            <Link href="/account">
              <Button variant="outline">Account Settings</Button>
            </Link>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Clock className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No activity yet. Start humanizing your first document.
            </p>
            <Link href="/">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
