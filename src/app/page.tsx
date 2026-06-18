import { PublicShell } from "@/components/layout/public-shell";
import { Hero } from "@/components/landing/hero";
import { ServicesSection } from "@/components/landing/services-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { ProfessionalsSection } from "@/components/landing/professionals-section";
import { Faq } from "@/components/landing/faq";
import { ContactSection } from "@/components/landing/contact-section";
import { CtaBanner } from "@/components/landing/cta-banner";

export default function HomePage() {
  return (
    <PublicShell>
      <Hero />
      <ServicesSection />
      <HowItWorks />
      <Benefits />
      <ProfessionalsSection />
      <Faq />
      <ContactSection />
      <CtaBanner />
    </PublicShell>
  );
}
