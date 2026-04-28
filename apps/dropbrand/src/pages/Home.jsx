import Header from "../components/Header";
import Footer from "../components/Footer";

import HeroSection from "../components/home/sections/HeroSection";
import AboutSection from "../components/home/sections/AboutSection";
import ServicesSection from "../components/home/sections/ServicesSection";
import WhyChooseSection from "../components/home/sections/WhyChooseSection";
import VideoStorySection from "../components/home/sections/VideoStorySection";
import FeaturesSection from "../components/home/sections/FeaturesSection";
import PricingSection from "../components/home/sections/PricingSection";
import ContactSection from "../components/home/sections/ContactSection";
import FAQSection from "../components/home/sections/FAQSection";
import TestimonialsSection from "../components/home/sections/TestimonialsSection";
import BlogSection from "../components/home/sections/BlogSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-light text-slate-900 overflow-x-hidden">
      <Header brandSlug="dropbrand" />

      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseSection />
      <VideoStorySection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <TestimonialsSection />
      <BlogSection />

      <Footer brandSlug="dropbrand" />
    </main>
  );
}