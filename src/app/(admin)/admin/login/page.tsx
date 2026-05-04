import { AdminLoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Admin Login — Humanly",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <AdminLoginForm />
    </div>
  );
}
