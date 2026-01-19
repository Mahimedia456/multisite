import Header from "../components/Header";
import SubNav from "../components/SubNav";
import SplitHero from "../components/SplitHero";
import BrandCards from "../components/BrandCards";
import TrustStats from "../components/TrustStats";
import Experience from "../components/Experience";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#140c1d] dark:text-[#faf8fc] transition-colors duration-300 min-h-screen">
      <Header />
      <SubNav />
      <main>
        <SplitHero />
        <BrandCards />
        <TrustStats />
        <Experience />
      </main>
      <Footer />
    </div>
  );
}
