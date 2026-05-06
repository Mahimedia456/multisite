import Header from "../Header";
import Footer from "../Footer";

import HeroSection from "../../pages/home/HeroSection";
import StepsSection from "../../pages/home/StepsSection";
import VideoSection from "../../pages/home/VideoSection";
import ProtectionSection from "../../pages/home/ProtectionSection";
import StatsSection from "../../pages/home/StatsSection";
import TestimonialsSection from "../../pages/home/TestimonialsSection";
import FeatureBoxesSection from "../../pages/home/FeatureBoxesSection";
import AboutSection from "../../pages/home/AboutSection";
import LeistungTabsSection from "../../pages/home/LeistungTabsSection";
import FAQSection from "../../pages/home/FAQSection";
import AngebotSection from "../../pages/home/AngebotSection";
import BlogSection from "../BlogSection";

const SECTION_MAP = {
  HeroSection,
  StepsSection,
  VideoSection,
  ProtectionSection,
  StatsSection,
  TestimonialsSection,
  FeatureBoxesSection,
  AboutSection,
  LeistungTabsSection,
  FAQSection,
  AngebotSection,
  BlogSection,
};

export default function TierischHomeRenderer({
  brandSlug = "allianz4",
  sections = [],
  showHeader = true,
  showFooter = true,
}) {
  return (
    <main className="w-full bg-background-light text-slate-900">
      {showHeader ? <Header brandSlug={brandSlug} /> : null}

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

      {showFooter ? <Footer brandSlug={brandSlug} /> : null}
      <div className="h-10" />
    </main>
  );
}