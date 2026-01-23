import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import BottomCTA from "../components/BottomCTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light text-[#121716] font-display overflow-x-hidden antialiased">
      <Header brandSlug="aamir" />
      <Hero />
      <HowItWorks />
      <WhyChoose />
      <Testimonials />
      <BottomCTA />
      <Footer brandSlug="aamir" />
    </div>
  );
}
