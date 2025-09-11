// src/pages/HomePage.tsx
import React from "react";
import HeroSection from "@/features/user/components/HeroSection";
import FeaturesSection from "@/features/user/components/FeaturesSection";
import HowItWorksSection from "@/features/user/components/HowItWorksSection";
import StatsSection from "@/components/common/StatsSection";
import TopBar from "@/features/user/components/RiderTopBar";

const HomePage: React.FC = () => (
  <>
    <TopBar />
    <main className="pt-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      {/* <Footer /> */}
    </main>
  </>
);

export default HomePage;
