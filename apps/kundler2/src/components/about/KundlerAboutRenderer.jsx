import Header from "../Header";
import Footer from "../Footer";

import HeroSection from "../../sections/about/HeroSection";
import MissionSection from "../../sections/about/MissionSection";
import CoreValues from "../../sections/about/CoreValues";
import HistorySection from "../../sections/about/HistorySection";
import SustainabilitySection from "../../sections/about/SustainabilitySection";
import TeamSection from "../../sections/about/TeamSection";
import KundlerSupport from "../../sections/about/KundlerSupport";

const SECTION_MAP = {
  HeroSection,
  MissionSection,
  CoreValues,
  HistorySection,
  SustainabilitySection,
  TeamSection,
  KundlerSupport,
};

export default function KundlerAboutRenderer({
  brandSlug = "kundler3",
  sections = [],
  showHeader = true,
  showFooter = true,
}) {
  return (
    <div className="min-h-screen bg-white text-[#0b0f12] overflow-x-hidden antialiased">
      {showHeader ? <Header brandSlug={brandSlug} /> : null}

      <main>
        {sections.map((section) => {
          if (section?.hidden) return null;

          const Comp = SECTION_MAP[section.type];
          if (!Comp) return null;

          return (
            <div key={section.id} data-section-id={section.id}>
              <Comp brandSlug={brandSlug} {...(section.props || {})} />
            </div>
          );
        })}
      </main>

      {showFooter ? <Footer brandSlug={brandSlug} /> : null}
    </div>
  );
}