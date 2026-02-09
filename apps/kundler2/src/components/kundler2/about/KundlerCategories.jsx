import MIcon from "../../MIcon";

const CATS = [
  {
    no: "01",
    title: "Auto, Haus & Recht",
    desc: "Schützen Sie, was Ihnen wichtig ist – verlässlich und flexibel.",
    icon: "home",
  },
  {
    no: "02",
    title: "Gesundheit & Freizeit",
    desc: "Leistungen, die im Alltag entlasten – von Zahn bis Reise.",
    icon: "flight",
  },
  {
    no: "03",
    title: "Tier",
    desc: "Für Hund & Katze: Schutz, der mit Ihrem Alltag mitgeht.",
    icon: "pets",
  },
  {
    no: "04",
    title: "Vorsorge & Vermögen",
    desc: "Vorsorgen, anlegen, absichern – passend zu Ihrem Lebensplan.",
    icon: "savings",
  },
];

export default function KundlerCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900">
              Passende Lösungen für Ihren Bedarf
            </h2>
            <p className="text-zinc-600 mt-2">
              Entdecken Sie Bereiche – übersichtlich, schnell und verständlich (Demo).
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900">
            Gesamtes Angebot <MIcon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATS.map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 hover:bg-white transition"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold text-zinc-500">{c.no}</div>
                <span className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MIcon name={c.icon} className="text-primary text-[20px]" />
                </span>
              </div>
              <div className="mt-5 font-extrabold text-zinc-900">{c.title}</div>
              <div className="mt-2 text-sm text-zinc-600">{c.desc}</div>

              <button className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900">
                Mehr erfahren <MIcon name="chevron_right" className="text-[18px]" />
              </button>
            </div>
          ))}
        </div>

        <div className="sm:hidden mt-8">
          <button className="w-full bg-primary hover:bg-primary-dark text-zinc-900 px-5 py-3 rounded-full font-extrabold transition shadow-primary/20">
            Gesamtes Angebot
          </button>
        </div>
      </div>
    </section>
  );
}
