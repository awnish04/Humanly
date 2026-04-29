"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function AccountPage() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async () => {
    try {
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.info("Password update requires email verification.");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await user?.delete();
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <main className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Manage your profile, security, and account.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* ── Profile Information ── */}
        <Card className="p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Profile Information
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your account&apos;s profile information.
            </p>
            <div className="h-px bg-border mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

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
            <Label>Language</Label>
            <select className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <Button onClick={handleSaveProfile} className="w-fit">
            Save
          </Button>
        </Card>

        {/* ── Update Password ── */}
        <Card className="p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Update Password
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure your account is using a long, random password to stay
              secure.
            </p>
            <div className="h-px bg-border mt-3" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleUpdatePassword} className="w-fit">
            Save
          </Button>
        </Card>

        {/* ── Plan & Usage ── */}
        <Card className="p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Plan & Usage
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Overview of your current subscription and monthly usage.
            </p>
            <div className="h-px bg-border mt-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Current Plan
              </p>
              <p className="text-xl font-black text-primary">Free</p>
              <Link
                href="/pricing"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
              >
                → Upgrade Plan
              </Link>
            </div>
            <div className="rounded-xl border border-border p-4 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Words Remaining
              </p>
              <p className="text-xl font-black text-foreground">500</p>
              <p className="text-xs text-muted-foreground">
                0 / 500 used this month
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Usage</span>
              <span>0%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          <Link href="/pricing" className="w-fit">
            <Button>Upgrade to Pro</Button>
          </Link>
        </Card>

        {/* ── Danger Zone ── */}
        <Card className="p-6 flex flex-col gap-4 border-destructive/30">
          <div>
            <h2 className="text-base font-bold text-destructive">
              Danger Zone
            </h2>
            <div className="h-px bg-border mt-3" />
          </div>
          <p className="text-sm text-muted-foreground max-w-none">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="destructive"
            className="w-fit"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </Button>
        </Card>
      </div>
    </main>
  );
}
