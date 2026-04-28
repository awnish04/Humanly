import Link from "next/link";
import { AuroraText } from "@/components/ui/aurora-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Log in",
  description: "Log in to your Humanly account.",
};

export default function LoginPage() {
  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden py-24 gap-10">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute rounded-full opacity-[0.15] blur-2xl"
          style={{
            width: "min(640px, 90vw)",
            height: "min(640px, 90vw)",
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 90%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="container-page relative z-10 flex flex-col items-center text-center gap-5">
        <BlurFade delay={0} duration={0.4} inView>
          <Badge
            variant="outline"
            className="rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
          >
            ✦ Login
          </Badge>
        </BlurFade>

        <BlurFade delay={0.1} duration={0.5} inView>
          <h1 className=" font-black">
            Welcome back to <AuroraText>Humanly</AuroraText>
          </h1>
        </BlurFade>

        <BlurFade delay={0.2} duration={0.5} inView>
          <p className="text-base sm:text-lg text-muted-foreground text-balance mx-auto">
            Log in to continue humanizing your content
          </p>
        </BlurFade>
      </div>

      {/* Contact card */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <BlurFade delay={0.1} duration={0.5}>
          <Card className="shadow-xl">
            <CardHeader className="pb-4">
              {/* Social login */}
              <Button variant="outline" className="w-full gap-2" type="button">
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button className="w-full" size="lg">
                Log in
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up free
                </Link>
              </p>
            </CardFooter>
          </Card>
        </BlurFade>
      </div>
    </main>
  );
}
