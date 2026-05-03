import { SignIn } from "@clerk/nextjs";
import { AuroraText } from "@/components/ui/aurora-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Log in",
  description: "Log in to your Humanly account.",
};

export default function LoginPage() {
  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden py-24 gap-10 min-h-screen">
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

      {/* Hero text */}
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
          <h1 className="font-black">
            Welcome back to <AuroraText>Humanly</AuroraText>
          </h1>
        </BlurFade>
        <BlurFade delay={0.2} duration={0.5} inView>
          <p className="text-base sm:text-lg text-muted-foreground text-balance mx-auto">
            Log in to continue humanizing your content
          </p>
        </BlurFade>
      </div>

      {/* Clerk's built-in SignIn — handles Google OAuth, email/password, everything */}
      <div className="relative z-10">
        <BlurFade delay={0.3} duration={0.5} inView>
          <SignIn
            routing="hash"
            signUpUrl="/login"
            forceRedirectUrl="/user-dashboard"
          />
        </BlurFade>
      </div>
    </main>
  );
}
