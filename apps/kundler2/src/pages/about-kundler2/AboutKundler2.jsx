import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { AutoReveal } from "@multisite/ui-inner-shared"; // ✅ use shared

import HeroSection from "./components/HeroSection";
import MissionSection from "./components/MissionSection";
import CoreValues from "./components/CoreValues";
import TeamSection from "./components/TeamSection";
import HistorySection from "./components/HistorySection";
import SustainabilitySection from "./components/SustainabilitySection";

export default function AboutKundler2() {
  const sections = [
    <HeroSection />,
    <MissionSection />,
    <CoreValues />,
    <TeamSection />,
    <HistorySection />,
    <SustainabilitySection />,
  ];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-dark dark:text-gray-100 transition-colors duration-300">
      <Header brandSlug="kundler3" />

      <main>
        {sections.map((node, i) => (
          <AutoReveal key={i} index={i}>
            {node}
          </AutoReveal>
        ))}
      </main>

      <Footer brandSlug="kundler3" />
    </div>
  );
}
