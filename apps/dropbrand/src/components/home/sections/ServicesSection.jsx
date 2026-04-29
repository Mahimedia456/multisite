const defaultItems = [
  {
    title: "Lebensversicherung",
    desc: "Sichern Sie die Zukunft Ihrer Familie mit flexiblen Lösungen.",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=900",
  },
  {
    title: "Krankenversicherung",
    desc: "Erhalten Sie Zugang zu zuverlässiger Gesundheitsversorgung.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=900",
  },
  {
    title: "Fahrzeugversicherung",
    desc: "Fahren Sie mit Sicherheit, wenn es darauf ankommt.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900",
  },
];

export default function ServicesSection({
  eyebrow = "Unsere Leistungen",
  headline = "Versicherungsschutz, der Sicherheit und Vertrauen gibt",
  buttonLabel = "Alle Leistungen ansehen",
  buttonHref = "/services",
  items = defaultItems,
}) {
  return (
    <section className="bg-white py-24" id="services">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#0f4a2c]">
              {eyebrow}
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-5xl">
              {headline}
            </h2>
          </div>

          <a
            href={buttonHref}
            className="inline-flex rounded-full bg-[#ffb347] px-6 py-3 font-black text-[#07361f]"
          >
            {buttonLabel}
          </a>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {items.map((s, i) => {
            const img = s.img || s.image;

            return (
              <article
                key={`${s.title}-${i}`}
                className="group overflow-hidden rounded-[2rem] bg-[#f8f4ed] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={img}
                    alt={s.title || ""}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{s.desc}</p>
                  <button className="mt-5 text-sm font-black text-[#0f4a2c]">
                    Mehr erfahren →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}