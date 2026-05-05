import Header from "../components/Header";
import Footer from "../components/Footer";

import Hero from "../sections/home/Hero";
import FeatureShowcase from "../sections/home/FeatureShowcase";
import Services from "../sections/home/Services";
import AboutSplit from "../sections/home/AboutSplit";
import VideoBand from "../sections/home/VideoBand";
import StatsBand from "../sections/home/StatsBand";
import Pricing from "../sections/home/Pricing";
import Showcase from "../sections/home/Showcase";
import CTAWide from "../sections/home/CTAWide";
import FAQ from "../sections/home/FAQ";
import Insights from "../sections/home/Insights";
import { BrandBlogSection } from "@multisite/ui-inner-shared";


export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0b0f12] overflow-x-hidden antialiased">
      <Header brandSlug="kundler3" />
      <main>
        <Hero />
        <FeatureShowcase />
        <Services />
        <AboutSplit />
        <VideoBand />
        <StatsBand />
        <Pricing />
        <Showcase />
        <CTAWide />
        <FAQ />
      <BrandBlogSection brandSlug="kundler3" limit={3} />
      </main>
      <Footer brandSlug="kundler3" />
    </div>
  );
}
