import MIcon from "../../MIcon";

const PLANS = [
  {
    badge: "Basis",
    price: "ab 1,60 %",
    title: "Kurzfristig und sicher parken: Allianz ParkDepot (Beispiel).",
    items: ["Online abschließen", "Leistungen vergleichen", "Persönliche Beratung", "Schnelle Hilfe im Schadenfall"],
  },
  {
    badge: "Empfehlung",
    price: "Premium",
    title: "Sofortleistung ohne Wartezeit – bis zu 100 % Kostenerstattung (Beispiel).",
    items: ["Online abschließen", "Leistungen vergleichen", "Persönliche Beratung", "Schnelle Hilfe im Schadenfall"],
  },
  {
    badge: "Individuell",
    price: "Beratung",
    title: "Passende Lösungen für Ihre Situation – persönlich oder digital.",
    items: ["Online abschließen", "Leistungen vergleichen", "Persönliche Beratung", "Schnelle Hilfe im Schadenfall"],
  },
];

export default function KundlerPlans() {
  return (
    <section id="plans" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900">Angebote im Überblick</h2>
            <p className="text-zinc-600 mt-2">
              Transparent, verständlich und passend zu Ihrem Bedarf (Demo-Inhalte).
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <div
              key={p.title}
              className={[
                "rounded-3xl border border-zinc-200 p-7 bg-zinc-50",
                p.badge === "Empfehlung" ? "ring-2 ring-primary/20 bg-white" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-600">
                  {p.badge}
                </span>
                <span className="text-sm font-extrabold text-primary">{p.price}</span>
              </div>

              <div className="mt-4 font-extrabold text-zinc-900">{p.title}</div>

              <ul className="mt-5 space-y-2">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-zinc-700">
                    <MIcon name="check" className="text-primary text-[18px]" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-6 w-full bg-primary hover:bg-primary-dark text-zinc-900 py-3 rounded-full font-extrabold transition shadow-primary/20">
                Mehr erfahren
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
