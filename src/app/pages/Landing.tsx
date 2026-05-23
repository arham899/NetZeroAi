import { HeroCarousel } from "../components/sections/HeroCarousel";
import { Features } from "../components/sections/Features";
import { HowItWorks } from "../components/sections/HowItWorks";
import { ImpactSection } from "../components/sections/ImpactSection";
import { CTASection } from "../components/sections/CTASection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <HeroCarousel />
      <Features />
      <HowItWorks />
      <ImpactSection />
      <CTASection />
    </div>
  );
}
