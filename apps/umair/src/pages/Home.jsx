import Header from "../components/Header";
import Hero from "../components/Hero";
import PolicyTypes from "../components/PolicyTypes";
import Calculator from "../components/Calculator";
import Process from "../components/Process";
import Stats from "../components/Stats";
import FAQ from "../components/FAQ";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#111417] dark:text-white font-display transition-colors duration-300 overflow-x-hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        <Hero />
        <PolicyTypes />
        <Calculator />
        <Process />
        <Stats />
        <FAQ />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
}
