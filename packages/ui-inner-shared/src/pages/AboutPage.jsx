import StickyHeader from "../sections/about/StickyHeader";
import SubTabs from "../sections/about/SubTabs";

import Hero from "../sections/about/Hero";
import MissionVision from "../sections/about/MissionVision";
import Timeline from "../sections/about/Timeline";
import TeamGrid from "../sections/about/TeamGrid";
import FinalCTA from "../sections/about/FinalCTA";
import LocalFooter from "../sections/about/Footer";

export default function AboutPage({ tenantConfig, HeaderSlot, FooterSlot, content }) {
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  const renderSection = (s, i) => {
    const p = s?.props || {};
    switch (s?.type) {
      case "Hero":
        return <Hero key={i} {...p} />;

      // New layout sections (as per your uploaded folder)
      case "MissionVision":
      case "MissionValues":
        // supports either key if your JSON uses MissionValues
        return <MissionVision key={i} {...p} />;

      case "Timeline":
        return <Timeline key={i} {...p} />;

      case "TeamGrid":
        return <TeamGrid key={i} {...p} />;

      case "FinalCTA":
        return <FinalCTA key={i} {...p} />;

      default:
        return null;
    }
  };

  return (
    <>
      {HeaderSlot ? <HeaderSlot tenant={tenantConfig} /> : <StickyHeader tenant={tenantConfig} />}
      <SubTabs tenant={tenantConfig} />

      <main className="max-w-7xl mx-auto px-6 space-y-24 py-16">
        {sections.map(renderSection)}
      </main>

      {FooterSlot ? <FooterSlot tenant={tenantConfig} /> : <LocalFooter tenant={tenantConfig} />}
    </>
  );
}
