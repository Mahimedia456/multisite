import StickyHeader from "../sections/about/StickyHeader";
import SubTabs from "../sections/about/SubTabs";

import Hero from "../sections/about/Hero";
import OurStory from "../sections/about/OurStory";
import MissionVision from "../sections/about/MissionVision";
import ValuesGrid from "../sections/about/ValuesGrid";
import BrandShowcase from "../sections/about/BrandShowcase";
import Leadership from "../sections/about/Leadership";
import SecurityTrust from "../sections/about/SecurityTrust";
import FinalCTA from "../sections/about/FinalCTA";
import LocalFooter from "../sections/about/Footer";

export default function AboutPage({ tenantConfig, HeaderSlot, FooterSlot, content }) {
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  const renderSection = (s, i) => {
    const p = s?.props || {};
    switch (s?.type) {
      case "Hero":
        return <Hero key={i} {...p} />;
      case "OurStory":
        return <OurStory key={i} {...p} />;
      case "MissionVision":
        return <MissionVision key={i} {...p} />;
      case "ValuesGrid":
        return <ValuesGrid key={i} {...p} />;
      case "BrandShowcase":
        return <BrandShowcase key={i} {...p} />;
      case "Leadership":
        return <Leadership key={i} {...p} />;
      case "SecurityTrust":
        return <SecurityTrust key={i} {...p} />;
      case "FinalCTA":
        return <FinalCTA key={i} {...p} />;
      default:
        return null;
    }
  };

  return (
    <>
      {HeaderSlot ? <HeaderSlot /> : <StickyHeader tenant={tenantConfig} />}
      <SubTabs tenant={tenantConfig} />

      <main className="max-w-7xl mx-auto px-6 space-y-24 py-16">
        {sections.map(renderSection)}
      </main>

      {FooterSlot ? <FooterSlot /> : <LocalFooter tenant={tenantConfig} />}
    </>
  );
}
