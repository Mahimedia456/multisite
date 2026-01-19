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
import Footer from "../sections/about/Footer";

export default function AboutPage({ tenantConfig, HeaderSlot }) {
  return (
    <>
      {/* ✅ If app provides its own header, use it. Else fallback to shared StickyHeader */}
      {HeaderSlot ? <HeaderSlot /> : <StickyHeader tenant={tenantConfig} />}

      <SubTabs tenant={tenantConfig} />

      <main className="max-w-7xl mx-auto px-6 space-y-24 py-16">
        <Hero />
        <OurStory />
        <MissionVision />
        <ValuesGrid />
        <BrandShowcase tenant={tenantConfig} />
        <Leadership />
        <SecurityTrust />
        <FinalCTA tenant={tenantConfig} />
      </main>

      <Footer tenant={tenantConfig} />
    </>
  );
}
