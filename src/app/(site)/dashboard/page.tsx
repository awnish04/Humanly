import { redirect } from "next/navigation";

// Keeps old /dashboard links working
export default function DashboardRedirect() {
  redirect("/user-dashboard");
}
