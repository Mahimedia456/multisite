// src/pages/AboutTierisch.jsx
import Header from "../components/Header";
import AboutHero from "../components/tierisch/about/AboutHero";
import AboutStats from "../components/tierisch/about/AboutStats";
import AboutMission from "../components/tierisch/about/AboutMission";
import AboutTrust from "../components/tierisch/about/AboutTrust";
import AboutTimeline from "../components/tierisch/about/AboutTimeline";
import AboutCTA from "../components/tierisch/about/AboutCTA";
import Footer from "../components/Footer";


export default function AboutTierisch() {
  return (
    <main className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
        <Header brandSlug="allianz4" />
      <AboutHero />
      <AboutStats />
      <AboutMission />
      <AboutTrust />
      <AboutTimeline />
      <AboutCTA />
       <Footer brandSlug="allianz4" />
            <div className="h-10" />
    </main>
  );
}
