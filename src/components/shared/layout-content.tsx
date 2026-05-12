"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { FooterWrapper } from "@/components/shared/footer-wrapper";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Toaster } from "@/components/ui/sonner";
import { AuthToast } from "@/components/shared/auth-toast";
import { GoToTopButton } from "@/components/shared/go-to-top-button";
import { DiscountPopup } from "@/components/shared/discount-popup";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <AuthToast />
      <main className="flex-1 w-full">
        {isAdminRoute ? (
          children
        ) : (
          <BackgroundBeamsWithCollision className="flex flex-col flex-1 w-full">
            {children}
          </BackgroundBeamsWithCollision>
        )}
      </main>
      {!isAdminRoute && <FooterWrapper />}
      <Toaster richColors position="top-center" />
      {!isAdminRoute && <GoToTopButton />}
      {!isAdminRoute && <DiscountPopup />}
    </>
  );
}
