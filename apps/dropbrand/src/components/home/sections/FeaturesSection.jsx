const defaultCardItems = [
  "Policenverwaltung",
  "Schadenservice",
  "Firmenversicherung",
  "Flexible Absicherung",
];

const defaultFeatures = [
  "Transparent und leicht verständlich",
  "Schnelle und einfache Schadenabwicklung",
  "Sicherer und verlässlicher Service",
];

export default function FeaturesSection({
  cardTitle = "Persönliche Expertenberatung",
  cardBody = "Unsere erfahrenen Berater helfen Ihnen, Tarife zu vergleichen und den passenden Schutz zu wählen.",
  cardItems = defaultCardItems,
  eyebrow = "Kernvorteile",
  headline = "Funktionen, die unseren Service besonders machen",
  features = defaultFeatures,
  stat1 = "98%",
  stat1Label = "Support-Zufriedenheit",
  stat2 = "500+",
  stat2Label = "Gelöste Schäden",
}) {
  return (
    <section className="bg-primary-dark py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8">
          <h3 className="text-2xl font-black">{cardTitle}</h3>

          <p className="mt-4 text-white/70">{cardBody}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {cardItems.map((x) => (
              <div key={x} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold">
                {x}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-widest text-accent">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            {headline}
          </h2>

          <div className="mt-8 space-y-4">
            {features.map((x, i) => (
              <div key={x} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-black">
                  {i + 1}. {x}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Entwickelt für klare Entscheidungen, einfache Abläufe und langfristige Sicherheit.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5">
            <div>
              <div className="text-5xl font-black text-accent">{stat1}</div>
              <p className="mt-2 text-sm text-white/60">{stat1Label}</p>
            </div>

            <div>
              <div className="text-5xl font-black text-accent">{stat2}</div>
              <p className="mt-2 text-sm text-white/60">{stat2Label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}