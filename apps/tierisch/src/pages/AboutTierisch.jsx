// src/pages/AboutTierisch.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

import AutoReveal from "../components/AutoReveal"; // ✅ add

import AboutHero from "../components/tierisch/about/AboutHero";
import AboutStats from "../components/tierisch/about/AboutStats";
import AboutMission from "../components/tierisch/about/AboutMission";
import AboutTrust from "../components/tierisch/about/AboutTrust";
import AboutTimeline from "../components/tierisch/about/AboutTimeline";
import AboutCTA from "../components/tierisch/about/AboutCTA";

export default function AboutTierisch() {
  const sections = [
    <AboutHero />,
    <AboutStats />,
    <AboutMission />,
    <AboutTrust />,
    <AboutTimeline />,
    <AboutCTA />,
  ];

  return (
    <main className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <Header brandSlug="allianz4" />

      {sections.map((Section, i) => (
        <AutoReveal key={i} index={i}>
          {Section}
        </AutoReveal>
      ))}

      <Footer brandSlug="allianz4" />
      <div className="h-10" />
    </main>
  );
}
