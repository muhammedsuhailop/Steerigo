import React from "react";
import { Header } from "@/features/public/components/Header";
import { HeroSection } from "@/features/public/components/HeroSection";
import { FeaturesSection } from "@/features/public/components/FeaturesSection";
import { HowItWorksSection } from "@/features/public/components/HowItWorksSection";
import { StatsSection } from "@/features/public/components/StatsSection";
import { Footer } from "@/features/public/components/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
