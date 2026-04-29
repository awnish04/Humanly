"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [autoSave, setAutoSave] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <main className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">App Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Customize your workspace and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* ── Editor Preferences ── */}
        <Card className="p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Editor Preferences
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize your writing and humanizing experience.
            </p>
            <div className="h-px bg-border mt-3" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <Label className="text-sm font-semibold text-foreground">
                Default Humanization Level
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set a preferred level for new documents.
              </p>
            </div>
            <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground w-full sm:w-auto">
              <option>Standard (Recommended)</option>
              <option>Basic</option>
              <option>Aggressive</option>
            </select>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <Label className="text-sm font-semibold text-foreground">
                Auto-save Documents
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically save your work while typing.
              </p>
            </div>
            <Toggle checked={autoSave} onChange={setAutoSave} />
          </div>
        </Card>

        {/* ── Email Notifications ── */}
        <Card className="p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Email Notifications
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control what emails you receive from us.
            </p>
            <div className="h-px bg-border mt-3" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Product Updates
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get notified about new features and improvements.
              </p>
            </div>
            <Toggle checked={productUpdates} onChange={setProductUpdates} />
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Marketing Emails
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receive offers, tips, and other marketing content.
              </p>
            </div>
            <Toggle checked={marketingEmails} onChange={setMarketingEmails} />
          </div>

          <Button
            className="w-fit"
            onClick={() => toast.success("Notification preferences saved")}
          >
            Save Preferences
          </Button>
        </Card>

        {/* ── Subscription & Billing — full width ── */}
        <Card className="p-6 flex flex-col gap-5 xl:col-span-2">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Subscription & Billing
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your plan and payment methods.
            </p>
            <div className="h-px bg-border mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Current Plan: <span className="text-primary">Free</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Usage: 0 / 500 words this month
                </p>
              </div>
              <Link href="/pricing">
                <Button size="sm">Upgrade Plan</Button>
              </Link>
            </div>

            <div className="rounded-xl border border-border p-4 flex flex-col gap-2">
              <p className="text-xs text-muted-foreground max-w-none">
                For billing inquiries or changes, please contact our support
                team.
              </p>
              <Link
                href="/contact"
                className="text-xs text-primary hover:underline w-fit"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
