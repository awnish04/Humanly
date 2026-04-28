import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactCard } from "@/components/ui/contact-card";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with the Humanly team. We respond within 1 business day.",
};

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section
        aria-label="Contact hero"
        className="relative flex flex-col items-center justify-center overflow-hidden pt-32 pb-16"
      >
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
              ✦ Contact
            </Badge>
          </BlurFade>

          <BlurFade delay={0.1} duration={0.5} inView>
            <h1 className="text-balance max-w-3xl">
              We&apos;d love to <AuroraText>hear from you</AuroraText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.5} inView>
            <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-balance mx-auto">
              Have a question, feedback, or need help? Fill out the form and our
              team will get back to you within 1 business day.
            </p>
          </BlurFade>
        </div>

        {/* Contact card */}
        <div className="section container-page">
          <BlurFade delay={0.2} duration={0.5} inView>
            <ContactCard
              title="Get in touch"
              description="If you have any questions about Humanly, need help with your account, or want to explore enterprise options — we're here to help."
              contactInfo={[
                {
                  icon: MailIcon,
                  label: "Email",
                  value: "hello@humanly.ai",
                },
                {
                  icon: PhoneIcon,
                  label: "Phone",
                  value: "+1 (555) 000-0000",
                },
                {
                  icon: ClockIcon,
                  label: "Response time",
                  value: "Within 1 business day",
                },
                {
                  icon: MapPinIcon,
                  label: "Location",
                  value: "San Francisco, CA",
                  className: "col-span-2",
                },
              ]}
            >
              <form className="w-full space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="Your name" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button className="w-full" type="submit">
                  Send Message
                </Button>
              </form>
            </ContactCard>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
