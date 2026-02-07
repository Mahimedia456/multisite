import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";
import { HOME_IMAGES } from "../../data/homeImages";

const bullets = [
  { title: "Persönliche Beratung", body: "Ansprechpartner:innen vor Ort – einfach finden & kontaktieren." },
  { title: "Digitale Services", body: "Online-Services, Hotlines und schnelle Hilfe im Schadenfall." },
  { title: "Transparente Leistungen", body: "Klare Vorteile, verständliche Optionen und passende Empfehlungen." },
];

export default function AboutSplit() {
  return (
    <section className="py-16 bg-[#f6f7f8]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
                Wir sind für Sie da
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">
                Beratung, Schutz und Vorsorge – passend zu Ihrem Leben
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-3 text-sm text-black/60 max-w-xl">
                Wir empfehlen Ihnen, Ihre persönliche Situation und Ihren Bedarf gemeinsam mit Fachleuten zu besprechen –
                gerne unterstützen wir Sie.
              </p>
            </Reveal>

            <Stagger className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5" from={180} step={90}>
              {bullets.map((b) => (
                <div key={b.title} className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-extrabold">
                    ✓
                  </div>
                  <div className="mt-4 font-extrabold">{b.title}</div>
                  <div className="mt-1 text-sm text-black/60">{b.body}</div>
                </div>
              ))}
            </Stagger>

            <Reveal delay={520}>
              <button className="mt-8 h-11 px-6 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
                Mehr über uns
              </button>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={120} y={22}>
              <div className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm bg-white">
                <img src={HOME_IMAGES.aboutRight} alt="" className="w-full h-[420px] object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
