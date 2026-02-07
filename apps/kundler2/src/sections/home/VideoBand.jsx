import Reveal from "../../components/Reveal";
import { HOME_IMAGES } from "../../data/homeImages";

export default function VideoBand() {
  return (
    <section className="relative py-20 bg-black">
      <div className="absolute inset-0">
        <img src={HOME_IMAGES.videoBg} alt="" className="w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <Reveal>
          <div className="text-2xl sm:text-3xl font-extrabold">
            Wir erklären in 60 Sekunden: So finden Sie die passende Absicherung
          </div>
        </Reveal>

        <Reveal delay={120}>
          <button className="mt-8 w-16 h-16 rounded-full bg-[#f5c400] text-black font-extrabold inline-flex items-center justify-center hover:opacity-90">
            ▶
          </button>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-4 text-sm text-white/70">Kurzvideo • Beratung, Produkte & Services</div>
        </Reveal>
      </div>
    </section>
  );
}
