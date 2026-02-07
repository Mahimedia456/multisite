import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";
import { HOME_IMAGES } from "../../data/homeImages";

const posts = [
  { title: "Was ist eine Sterbeurkunde? Funktion, Inhalt & Antrag", img: HOME_IMAGES.insight1 },
  { title: "Pflege im Ausland: Kosten & Besonderheiten", img: HOME_IMAGES.insight2 },
  { title: "Was kostet ein Hund im Monat? Tipps für Ihre Budgetplanung", img: HOME_IMAGES.insight3 },
];

export default function Insights() {
  return (
    <section className="py-16 bg-white" id="insights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Reveal>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
              Tipps der Redaktion
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">
              Lesen lohnt sich: Ratgeber & Insights
            </h2>
          </Reveal>
        </div>

        <Stagger className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6" from={120} step={90}>
          {posts.map((p) => (
            <article key={p.title} className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm">
              <img src={p.img} alt="" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">Ratgeber</div>
                <h3 className="mt-2 font-extrabold text-lg leading-snug">{p.title}</h3>
                <button className="mt-5 h-10 px-5 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
                  Mehr lesen
                </button>
              </div>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
