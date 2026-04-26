import type { Metadata } from "next";
import { Geist_Mono, Oxanium } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const oxanium = Oxanium({
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
      className={cn(
        "h-full antialiased font-sans",
        oxanium.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1 w-full">
            <BackgroundBeamsWithCollision className="flex flex-col flex-1 w-full">
              {children}
            </BackgroundBeamsWithCollision>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
