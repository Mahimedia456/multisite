import Navbar from "./components/main/Navbar";
import HeroFI from "./components/main/HeroFI";
import AboutFI from "./components/main/AboutFI";
import BenefitsFI from "./components/main/BenefitsFI";
import NetworkFI from "./components/main/NetworkFI";
import TeamFI from "./components/main/TeamFI";
import JoinCtaFI from "./components/main/JoinCtaFI";
import MembershipStepsFI from "./components/main/MembershipStepsFI";
import ContactFI from "./components/main/ContactFI";
import FooterFI from "./components/main/FooterFI";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <HeroFI />
      <AboutFI />
      <BenefitsFI />
      <NetworkFI />
      <TeamFI />
      <JoinCtaFI />
      <MembershipStepsFI />
      <ContactFI />
      <FooterFI />
    </div>
  );
}
