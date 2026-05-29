import React from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components";
import { FeaturesSection } from "../components";
import { StatsSection } from "../components";
import { Footer } from "../components";
import HowItWorksSection from "../components/HowItWorksSection/HowItWorksSection";

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
