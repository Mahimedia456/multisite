import Header from "../Header";
import Footer from "../Footer";

import AboutHeroSection from "./sections/AboutHeroSection";
import AboutIntroSection from "./sections/AboutIntroSection";
import AboutValuesSection from "./sections/AboutValuesSection";
import AboutStatsSection from "./sections/AboutStatsSection";
import AboutTeamSection from "./sections/AboutTeamSection";
import AboutCTASection from "./sections/AboutCTASection";

const SECTION_MAP = {
  AboutHeroSection,
  AboutIntroSection,
  AboutValuesSection,
  AboutStatsSection,
  AboutTeamSection,
  AboutCTASection,
};

export default function DropbrandAboutRenderer({
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