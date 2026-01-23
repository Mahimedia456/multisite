// packages/ui-inner-shared/src/pages/TeamPage.jsx
import StickyHeader from "../sections/about/StickyHeader";
import SubTabs from "../sections/about/SubTabs";
import LocalFooter from "../sections/about/Footer";

import Hero from "../sections/team/Hero";
import Intro from "../sections/team/Intro";
import TeamGrid from "../sections/team/TeamGrid";
import Gallery from "../sections/team/Gallery";
import Benefits from "../sections/team/Benefits";
import CareerCTA from "../sections/team/CareerCTA";

export default function TeamPage({ tenantConfig, HeaderSlot, FooterSlot, content }) {
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  const renderSection = (s, i) => {
    const p = s?.props || {};
    switch (s?.type) {
      case "Hero":
        return <Hero key={i} {...p} />;

      case "Intro":
        return <Intro key={i} {...p} />;

      case "TeamGrid":
        return <TeamGrid key={i} {...p} />;

      case "Gallery":
        return <Gallery key={i} {...p} />;

      case "Benefits":
        return <Benefits key={i} {...p} />;

      case "CareerCTA":
        return <CareerCTA key={i} {...p} />;

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
