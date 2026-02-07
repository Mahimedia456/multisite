import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";
import { HOME_IMAGES } from "../../data/homeImages";

const items = [
  { title: "Passende Versicherungen zu Ihrem Bedarf", a: HOME_IMAGES.project1, b: HOME_IMAGES.project2, c: HOME_IMAGES.project3 },
];

export default function Showcase() {
  const x = items[0];

  return (
    <section className="py-16 bg-white" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">Empfehlungen</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">{x.title}</h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="hidden sm:block">
            <button className="h-10 px-5 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
              Alles ansehen
            </button>
          </Reveal>
        </div>

        <Stagger className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6" from={120} step={90}>
          {[
            { img: x.a, title: "Kfz-Versicherung", body: "Optimaler Schutz für Ihr Auto – flexibel und zuverlässig." },
            { img: x.b, title: "Private Haftpflicht", body: "Abwehr unberechtigter Forderungen – auch vor Gericht." },
            { img: x.c, title: "Rechtsschutz", body: "Damit Sie Ihr gutes Recht bekommen – inkl. Service-Hotline." },
          ].map((card, i) => (
            <div key={`${card.title}-${i}`} className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm">
              <img src={card.img} alt="" className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="text-sm font-extrabold">{card.title}</div>
                <div className="mt-1 text-sm text-black/60">{card.body}</div>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
