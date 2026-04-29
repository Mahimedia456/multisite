import Header from "../Header";
import Footer from "../Footer";

import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ServicesSection from "./sections/ServicesSection";
import WhyChooseSection from "./sections/WhyChooseSection";
import VideoStorySection from "./sections/VideoStorySection";
import FeaturesSection from "./sections/FeaturesSection";
import PricingSection from "./sections/PricingSection";
import ContactSection from "./sections/ContactSection";
import FAQSection from "./sections/FAQSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import BlogSection from "./sections/BlogSection";

const SECTION_MAP = {
  HeroSection,
  AboutSection,
  ServicesSection,
  WhyChooseSection,
  VideoStorySection,
  FeaturesSection,
  PricingSection,
  ContactSection,
  FAQSection,
  TestimonialsSection,
  BlogSection,
};

export default function DropbrandHomeRenderer({
  brandSlug = "dropbrand",
  sections = [],
  sectionRefs,
  showHeader = true,
  showFooter = true,
}) {
  return (
    <main className="min-h-screen bg-background-light text-slate-900 overflow-x-hidden">
      {showHeader ? <Header brandSlug={brandSlug} /> : null}

      {sections.map((section) => {
        if (section?.hidden) return null;

        const Comp = SECTION_MAP[section.type];
        if (!Comp) return null;

        return (
          <div
            key={section.id}
            ref={(el) => {
              if (el && sectionRefs?.current) {
                sectionRefs.current[section.id] = el;
              }
            }}
            data-section-id={section.id}
          >
            <Comp {...(section.props || {})} />
          </div>
        );
      })}

      {showFooter ? <Footer brandSlug={brandSlug} /> : null}
    </main>
  );
}