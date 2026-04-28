"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { User, Globe, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "plan", label: "Plan & Limits", icon: Globe },
  { id: "security", label: "Security", icon: Lock },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function AccountPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState(user?.fullName ?? "");

  const handleSaveProfile = async () => {
    try {
      const parts = displayName.trim().split(" ");
      await user?.update({
        firstName: parts[0],
        lastName: parts.slice(1).join(" ") || undefined,
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await user?.delete();
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <main className="pt-28 section">
      <div className="container-page">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-foreground">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile, security, and preferences.
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
                      ? tab.id === "danger"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
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
            {activeTab === "profile" && (
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Profile Information
                  </h2>
                  <div className="h-px bg-border mt-3" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>Email Address</Label>
                    <Input
                      value={user?.emailAddresses?.[0]?.emailAddress ?? ""}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed via settings.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-fit">
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === "plan" && (
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Plan & Usage
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Overview of your current subscription and monthly usage.
                  </p>
                  <div className="h-px bg-border mt-3" />
                </div>
                <Button className="w-fit" variant="outline">
                  Free Plan
                </Button>
                <div className="rounded-xl border border-border p-5 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Monthly Word Limit
                  </p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-foreground">
                      0{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / 500 used
                      </span>
                    </p>
                    <p className="text-primary font-bold">
                      500{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        words remaining
                      </span>
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                <Button className="w-full">Upgrade to Pro</Button>
              </Card>
            )}

            {activeTab === "security" && (
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Change Password
                  </h2>
                  <div className="h-px bg-border mt-3" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter new password"
                    />
                  </div>
                  <Button
                    className="w-fit"
                    onClick={() =>
                      toast.info("Password update requires email verification.")
                    }
                  >
                    Update Password
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === "danger" && (
              <Card className="p-6 flex flex-col gap-4 border-destructive/30">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Delete Account
                  </h2>
                  <div className="h-px bg-border mt-3" />
                </div>
                <p className="text-sm text-muted-foreground max-w-none">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <Button
                  variant="destructive"
                  className="w-fit"
                  onClick={handleDeleteAccount}
                >
                  Delete My Account
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
