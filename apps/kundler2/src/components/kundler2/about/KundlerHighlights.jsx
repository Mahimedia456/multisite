import MIcon from "../../MIcon";

const ITEMS = [
  {
    title: "Empfehlungen",
    desc:
      "Von Kfz bis Rechtsschutz: entdecken Sie Highlights, Vorteile und passende Optionen – transparent und verständlich.",
    cta1: "Produkte ansehen",
    cta2: "Beratung & Kontakt",
  },
  {
    title: "Produkte & Bereiche",
    desc:
      "Entdecken Sie ausgewählte Versicherungen und Vorsorge-Angebote – übersichtlich und schnell.",
    cta1: "Gesamtes Angebot",
    cta2: "Mehr über uns",
  },
];

export default function KundlerHighlights() {
  return (
    <section className="py-14 bg-[rgb(var(--bg-light))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {ITEMS.map((it) => (
            <div
              key={it.title}
              className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-zinc-900">{it.title}</h3>
                  <p className="mt-3 text-zinc-600">{it.desc}</p>
                </div>
                <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MIcon name="auto_awesome" className="text-primary text-[22px]" />
                </span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button className="bg-primary hover:bg-primary-dark text-zinc-900 px-5 py-3 rounded-full font-extrabold transition shadow-primary/20">
                  {it.cta1}
                </button>
                <button className="px-5 py-3 rounded-full font-extrabold border border-zinc-200 hover:bg-zinc-50 transition text-zinc-800">
                  {it.cta2}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
