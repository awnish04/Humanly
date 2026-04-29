import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Star,
  Diamond,
  BarChart2,
  Sparkles,
  ScanSearch,
  PenLine,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await currentUser();
  const name = user?.firstName ?? user?.fullName ?? "there";

  return (
    <main className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hello, {name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here&apos;s what&apos;s new today
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="size-4" />
            Your Plan
          </div>
          <p className="text-2xl font-black text-foreground">Free</p>
          <Link
            href="/pricing"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-3" /> Upgrade Plan
          </Link>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Diamond className="size-4" />
            Available Credits
          </div>
          <p className="text-2xl font-black text-foreground">
            500{" "}
            <span className="text-sm font-normal text-muted-foreground">
              words
            </span>
          </p>
          <Link
            href="/account"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-3" /> View usage
          </Link>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart2 className="size-4" />
            Usage
          </div>
          <p className="text-2xl font-black text-foreground">
            0{" "}
            <span className="text-sm font-normal text-muted-foreground">
              requests this month
            </span>
          </p>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-3" /> Humanize document
          </Link>
        </Card>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Humanizer</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-none">
                Transform AI-generated text into human-like content
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="w-full" size="sm">
              Start Humanizing
            </Button>
          </Link>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-sky-400/10 flex items-center justify-center shrink-0">
              <ScanSearch className="size-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">AI Detector</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-none">
                Check if text was written by AI or a human
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm">
            Detect AI
          </Button>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-violet-400/10 flex items-center justify-center shrink-0">
              <PenLine className="size-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Generate</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-none">
                Generate undetectable AI content
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm">
            Start Writing
          </Button>
        </Card>
      </div>
    </main>
  );
}
