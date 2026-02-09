import React from "react";
import TopNav from "./components/TopNav";
import HeroSection from "./components/HeroSection";
import MissionSection from "./components/MissionSection";
import CoreValues from "./components/CoreValues";
import TeamSection from "./components/TeamSection";
import HistorySection from "./components/HistorySection";
import SustainabilitySection from "./components/SustainabilitySection";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutKundler2() {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-dark dark:text-gray-100 transition-colors duration-300">
      
      <Header brandSlug="kundler3" /> 
      <main>
        <HeroSection />
        <MissionSection />
        <CoreValues />
        <TeamSection />
        <HistorySection />
        <SustainabilitySection />
      </main>
     <Footer brandSlug="kundler3" />
    </div>
  );
}
