import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { StatsSection } from "@/components/home/stats-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { DetectorsSection } from "@/components/home/detectors-section";
import { ComparisonSection } from "@/components/home/comparison-section";
import { TestimonialsSection } from "@/components/home/testimonials/testimonials-section";


export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <DetectorsSection />
      <ComparisonSection />
      <TestimonialsSection />
    </div>
  );
}
