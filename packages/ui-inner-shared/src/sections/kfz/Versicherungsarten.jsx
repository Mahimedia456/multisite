function Card({ variant = "default", badge, title, price, desc, bullets, cta }) {
  const isFeatured = variant === "featured";
  return (
    <div
      className={[
        "bg-white rounded-2xl p-8 flex flex-col h-full relative",
        isFeatured ? "border-2 border-primary" : "border border-slate-200",
      ].join(" ")}
    >
      {badge ? (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
          {badge}
        </div>
      ) : null}

      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="text-4xl font-black text-primary mb-6">
        {price}{" "}
        <span className="text-sm font-normal text-slate-500">/ Jahr</span>
      </div>
      <p className="text-sm text-slate-600 mb-8 flex-grow">{desc}</p>

      <ul className="space-y-3 mb-8">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-primary text-lg">
              check_circle
            </span>
            {b}
          </li>
        ))}
      </ul>

      <button
        className={[
          "w-full py-3 rounded-lg font-bold transition-all",
          isFeatured
            ? "bg-primary text-white hover:bg-primary/90"
            : "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ].join(" ")}
      >
        {cta || "Auswählen"}
      </button>
    </div>
  );
}

export default function Versicherungsarten({
  id = "versicherungsarten",
  title = "Unsere Versicherungsarten",
  subtitle = "Wählen Sie den Schutz, der zu Ihnen passt.",
  items = [
    {
      title: "Haftpflicht",
      price: "ab 99 €",
      desc: "Die gesetzlich vorgeschriebene Basisabsicherung für Schäden, die Sie anderen zufügen.",
      bullets: ["100 Mio. € Deckung", "Umweltschadenversicherung", "Mallorca-Police"],
      variant: "default",
    },
    {
      title: "Teilkasko",
      price: "ab 149 €",
      desc: "Schutz bei Diebstahl, Glasbruch, Brand und Unwetterschäden am eigenen Auto.",
      bullets: ["Alle Haftpflicht-Leistungen", "Wildunfälle aller Art", "Marderbiss inkl. Folgeschäden"],
      variant: "featured",
      badge: "Meistgewählt",
    },
    {
      title: "Vollkasko",
      price: "ab 249 €",
      desc: "Rundum-Sorglos-Paket: Auch bei selbstverschuldeten Unfällen und Vandalismus.",
      bullets: ["Alle Teilkasko-Leistungen", "Eigenkollisionsschäden", "Mutwillige Beschädigung"],
      variant: "default",
    }
  ]
}) {
  return (
    <section className="py-24" id={id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-slate-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <Card key={i} {...it} />
          ))}
        </div>
      </div>
    </section>
  );
}
