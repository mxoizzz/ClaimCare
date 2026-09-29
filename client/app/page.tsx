import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ClaimDashboard } from "@/components/claim-dashboard";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />

      {/* The actual Application logic for the Hackathon */}
      <section id="application" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-primary mb-6 uppercase tracking-widest">
            <span className="w-8 h-px bg-primary/30" />
            Interactive Module
            <span className="w-8 h-px bg-primary/30" />
          </span>
          <h2 className="text-4xl lg:text-5xl font-display tracking-tight text-foreground mb-4">
            Test The Engine
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg relative z-20">
            Upload a test medical insurance policy to initialize local analysis.
          </p>
        </div>

        <ClaimDashboard />
      </section>

      <FeaturesSection />
      <FooterSection />
    </main>
  );
}
