"use client";

import { useState } from "react";
import { Sparkles, PenLine, Bell, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const TABS = [
  { id: "appearance", label: "Appearance", icon: Sparkles },
  { id: "editor", label: "Editor", icon: PenLine },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing & Plans", icon: CreditCard },
];

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
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");
  const { theme, setTheme } = useTheme();
  const [autoSave, setAutoSave] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <main className="pt-28 section">
      <div className="container-page">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-foreground">App Settings</h1>
          <p className="text-muted-foreground mt-1">
            Customize your workspace and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 max-w-4xl mx-auto">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <nav className="flex flex-col gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "appearance" && (
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Theme Preference
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose how the application looks to you.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "flex flex-col gap-2 rounded-xl border-2 p-3 transition-all",
                        theme === t
                          ? "border-primary"
                          : "border-border hover:border-muted-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "h-20 rounded-lg",
                          t === "light" ? "bg-gray-100" : "bg-zinc-900",
                        )}
                      />
                      <p className="text-sm font-medium text-foreground capitalize">
                        {t} Mode
                      </p>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "editor" && (
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Editor Preferences
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize your writing and humanizing experience.
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Default Humanization Level
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Set a preferred level for new documents.
                      </p>
                    </div>
                    <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground">
                      <option>Standard (Recommended)</option>
                      <option>Basic</option>
                      <option>Aggressive</option>
                    </select>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
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
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Email Notifications
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Control what emails you receive from us.
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Product Updates
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Get notified about new features and improvements.
                      </p>
                    </div>
                    <Toggle
                      checked={productUpdates}
                      onChange={setProductUpdates}
                    />
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Marketing Emails
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Receive offers, tips, and other marketing content.
                      </p>
                    </div>
                    <Toggle
                      checked={marketingEmails}
                      onChange={setMarketingEmails}
                    />
                  </div>
                </div>
                <Button
                  className="w-fit"
                  onClick={() =>
                    toast.success("Notification preferences saved")
                  }
                >
                  Save Preferences
                </Button>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Subscription & Billing
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your plan and payment methods.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Current Plan: <span className="text-primary">Free</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Usage: 0 / 500 words this month
                    </p>
                  </div>
                  <Button size="sm">Upgrade Plan</Button>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Billing Settings
                  </h3>
                  <div className="rounded-xl border border-border p-4 flex flex-col gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      Custom Plan Active
                    </p>
                    <p className="text-xs text-muted-foreground max-w-none">
                      Your current plan was configured manually. For billing
                      inquiries, please contact our support team.
                    </p>
                    <button className="text-xs text-primary hover:underline text-left w-fit">
                      Contact Support →
                    </button>
                    <button className="text-xs text-destructive hover:underline text-left w-fit">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
