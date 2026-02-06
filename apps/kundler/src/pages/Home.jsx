import Hero from "../sections/home/Hero";
import Intro from "../sections/home/Intro";
import Services from "../sections/home/Services";
import Features from "../sections/home/Features";
import ServiceContact from "../sections/home/ServiceContact";
import Experience from "../sections/home/Experience";
import TeamHero from "../sections/home/TeamHero";
import TeamGrid from "../sections/home/TeamGrid";
import EventHighlight from "../sections/home/EventHighlight";
import Partners from "../sections/home/Partners";
import Stats from "../sections/home/Stats";
import Luxury from "../sections/home/Luxury";
import News from "../sections/home/News";
import Locations from "../sections/home/Locations";
import Instagram from "../sections/home/Instagram";

export default function Home() {
  return (
    <main className="bg-white text-neutral-900">
      <Hero />
      <Intro />
      <Services />
      <Features />
      <ServiceContact />
      <Experience />
      <TeamHero />
      <TeamGrid />
      <EventHighlight />
      <Partners />
      <Stats />
      <Luxury />
      <News />
      <Locations />
      <Instagram />
    </main>
  );
}
