import React from "react";
import Header from "../components/Header";

import HeroSection from "./home/HeroSection";
import StepsSection from "./home/StepsSection";
import VideoSection from "./home/VideoSection";
import ProtectionSection from "./home/ProtectionSection";
import StatsSection from "./home/StatsSection";
import TestimonialsSection from "./home/TestimonialsSection";
import FeatureBoxesSection from "./home/FeatureBoxesSection";
import AboutSection from "./home/AboutSection";
import LeistungTabsSection from "./home/LeistungTabsSection";
import FAQSection from "./home/FAQSection";
import AngebotSection from "./home/AngebotSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-[#F6F8FB] text-slate-900">
      <Header brandSlug="allianz4" />
      <HeroSection />
      <StepsSection />
      <VideoSection />
      <ProtectionSection />
      <StatsSection />
      <TestimonialsSection />
      <FeatureBoxesSection />
      <AboutSection />
      <LeistungTabsSection />
      <FAQSection />
      <AngebotSection />
      <Footer brandSlug="aamir" />
      <div className="h-10" />
    </main>
  );
}
