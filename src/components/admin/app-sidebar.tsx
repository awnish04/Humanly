"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  DollarSign,
  Tag,
  Mail,
  Settings,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { NavMain } from "@/components/admin/nav-main";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";

const NAV_ANALYTICS = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart2 },
];

const NAV_USERS = [
  { title: "User Management", url: "/admin/users", icon: Users },
];

const NAV_REVENUE = [
  { title: "Revenue", url: "/admin/revenue", icon: DollarSign },
  { title: "Coupons", url: "/admin/coupons", icon: Tag },
  { title: "Email Broadcast", url: "/admin/email", icon: Mail },
];

const NAV_SYSTEM = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/admin/dashboard" />}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <Zap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">Humanly</span>
                <span className="truncate text-xs text-muted-foreground">
                  Admin Panel
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <NavMain items={NAV_ANALYTICS} label="Analytics" />
        <SidebarSeparator />
        <NavMain items={NAV_USERS} label="Users" />
        <SidebarSeparator />
        <NavMain items={NAV_REVENUE} label="Revenue" />
        <SidebarSeparator />
        <NavMain items={NAV_SYSTEM} label="System" />
        <SidebarSeparator />
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Back to site"
            >
              <ArrowLeft />
              <span>Back to Site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
