// packages/ui-inner-shared/src/pages/CareerPage.jsx (or apps/aamir/src/pages/CareerPage.jsx)
import StickyHeader from "../sections/about/StickyHeader";
import SubTabs from "../sections/about/SubTabs";
import LocalFooter from "../sections/about/Footer";

import Hero from "../sections/career/Hero";
import Why from "../sections/career/Why";
import Jobs from "../sections/career/Jobs";
import Steps from "../sections/career/Steps";
import Life from "../sections/career/Life";
import TeamPromo from "../sections/career/TeamPromo";

export default function CareerPage({ tenantConfig, HeaderSlot, FooterSlot, content }) {
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  const renderSection = (s, i) => {
    const p = s?.props || {};
    switch (s?.type) {
      case "Hero":
        return <Hero key={i} {...p} />;
      case "Why":
        return <Why key={i} {...p} />;
      case "Jobs":
        return <Jobs key={i} {...p} />;
      case "Steps":
        return <Steps key={i} {...p} />;
      case "Life":
        return <Life key={i} {...p} />;
      case "TeamPromo":
        return <TeamPromo key={i} {...p} />;
      default:
        return null;
    }
  };

  return (
    <>
      {HeaderSlot ? <HeaderSlot tenant={tenantConfig} /> : <StickyHeader tenant={tenantConfig} />}
      <SubTabs tenant={tenantConfig} />

      <main className="max-w-7xl mx-auto px-6 space-y-20 py-16">
        {sections.map(renderSection)}
      </main>

      {FooterSlot ? <FooterSlot tenant={tenantConfig} /> : <LocalFooter tenant={tenantConfig} />}
    </>
  );
}
