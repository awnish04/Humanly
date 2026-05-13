import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { FooterWrapper } from "@/components/shared/footer-wrapper";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Toaster } from "@/components/ui/sonner";
import { AuthToast } from "@/components/shared/auth-toast";
import { GoToTopButton } from "@/components/shared/go-to-top-button";
import { DiscountPopup } from "@/components/shared/discount-popup";
import { VisitorTracker } from "@/components/admin/visitor-tracker";
import { OnlineStatusTracker } from "@/components/shared/online-status-tracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Humanly — Make AI Content Sound 100% Human",
    template: "%s | Humanly",
  },
  description:
    "Transform AI drafts into natural, engaging writing for blogs, emails, and social posts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            <AuthToast />
            <main className="flex-1 w-full">
              <BackgroundBeamsWithCollision className="flex flex-col flex-1 w-full">
                {children}
              </BackgroundBeamsWithCollision>
            </main>
            <FooterWrapper />
            <Toaster richColors position="top-center" />
            <GoToTopButton />
            <DiscountPopup />
            <VisitorTracker />
            <OnlineStatusTracker />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
