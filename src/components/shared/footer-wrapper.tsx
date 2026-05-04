"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

const DASHBOARD_ROUTES = ["/user-dashboard", "/admin"];

export function FooterWrapper() {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));
  if (isDashboard) return null;
  return <Footer />;
}
