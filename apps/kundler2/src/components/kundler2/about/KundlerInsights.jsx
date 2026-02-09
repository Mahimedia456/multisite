const INSIGHTS = [
  { tag: "Ratgeber", title: "Was ist eine Sterbeurkunde? Funktion, Inhalt & Antrag" },
  { tag: "Ratgeber", title: "Pflege im Ausland: Kosten & Besonderheiten" },
  { tag: "Ratgeber", title: "Was kostet ein Hund im Monat? Tipps für Ihre Budgetplanung" },
];

export default function KundlerInsights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900">Tipps der Redaktion</h2>
            <p className="text-zinc-600 mt-2">Lesen lohnt sich: Ratgeber & Insights (Demo).</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {INSIGHTS.map((x) => (
            <div key={x.title} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 hover:bg-white transition">
              <div className="text-xs font-extrabold uppercase tracking-widest text-primary">
                {x.tag}
              </div>
              <div className="mt-3 font-extrabold text-zinc-900">{x.title}</div>
              <button className="mt-5 text-sm font-extrabold text-zinc-900">
                Mehr lesen
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
