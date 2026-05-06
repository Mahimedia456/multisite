import Header from "../Header";
import Footer from "../Footer";

import Hero from "../../sections/home/Hero";
import FeatureShowcase from "../../sections/home/FeatureShowcase";
import Services from "../../sections/home/Services";
import AboutSplit from "../../sections/home/AboutSplit";
import VideoBand from "../../sections/home/VideoBand";
import StatsBand from "../../sections/home/StatsBand";
import Pricing from "../../sections/home/Pricing";
import Showcase from "../../sections/home/Showcase";
import CTAWide from "../../sections/home/CTAWide";
import FAQ from "../../sections/home/FAQ";
import BlogSection from "../../sections/home/BlogSection";

const SECTION_MAP = {
  Hero,
  FeatureShowcase,
  Services,
  AboutSplit,
  VideoBand,
  StatsBand,
  Pricing,
  Showcase,
  CTAWide,
  FAQ,
  BlogSection,
};

export default function KundlerHomeRenderer({
  brandSlug = "kundler3",
  sections = [],
  sectionRefs,
  showHeader = true,
  showFooter = true,
}) {
  return (
    <div className="min-h-screen bg-background-light text-text-dark overflow-x-hidden antialiased">
      {showHeader ? <Header brandSlug={brandSlug} /> : null}

      <main>
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
              <Comp brandSlug={brandSlug} {...(section.props || {})} />
            </div>
          );
        })}
      </main>

      {showFooter ? <Footer brandSlug={brandSlug} /> : null}
    </div>
  );
}