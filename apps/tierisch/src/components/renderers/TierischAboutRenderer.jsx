import Header from "../Header";
import Footer from "../Footer";

import AboutHero from "../tierisch/about/AboutHero";
import AboutStats from "../tierisch/about/AboutStats";
import AboutMission from "../tierisch/about/AboutMission";
import AboutTrust from "../tierisch/about/AboutTrust";
import AboutTimeline from "../tierisch/about/AboutTimeline";
import AboutCTA from "../tierisch/about/AboutCTA";

const SECTION_MAP = {
  AboutHero,
  AboutStats,
  AboutMission,
  AboutTrust,
  AboutTimeline,
  AboutCTA,
};

export default function TierischAboutRenderer({
  brandSlug = "allianz4",
  sections = [],
  showHeader = true,
  showFooter = true,
}) {
  return (
    <main className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
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