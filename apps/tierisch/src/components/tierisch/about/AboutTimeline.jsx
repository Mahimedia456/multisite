const DEFAULT_TIMELINE = [
  {
    year: "2018",
    title: "Die Idee entsteht",
    text: "Aus dem Wunsch nach verständlichen Tarifen und fairer Absicherung für Tierhalter in Deutschland.",
  },
  {
    year: "2020",
    title: "10.000 geschützte Pfoten",
    text: "Ein Meilenstein: Immer mehr Tierhalter setzen auf digitale Prozesse und transparente Leistungen.",
  },
  {
    year: "2022",
    title: "Digital-Award",
    text: "Auszeichnung für nutzerfreundliche Schadens- und Erstattungsprozesse.",
  },
  {
    year: "Heute",
    title: "Ihr Partner des Vertrauens",
    text: "Ständige Weiterentwicklung, bessere Tarife und Support, wenn es darauf ankommt.",
  },
];

export default function AboutTimeline({
  title = "Unsere Reise",
  items = DEFAULT_TIMELINE,
}) {
  const timeline = Array.isArray(items) && items.length ? items : DEFAULT_TIMELINE;

  return (
    <section id="timeline" className="py-24 bg-[rgb(var(--background))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-16 text-center text-zinc-900">
          {title}
        </h2>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-primary/10 hidden md:block" />

          <div className="space-y-12">
            {timeline.map((t, idx) => {
              const left = idx % 2 === 0;

              return (
                <div
                  key={`${t.year}-${t.title}`}
                  className="relative flex flex-col md:flex-row items-center justify-between"
                >
                  <div
                    className={[
                      "md:w-[45%] text-center",
                      left ? "md:text-right" : "md:order-3 md:text-left",
                    ].join(" ")}
                  >
                    <h3 className="text-xl font-extrabold text-primary">
                      {t.year}
                    </h3>
                    <p className="font-extrabold text-lg mb-2 text-zinc-900">
                      {t.title}
                    </p>
                    <p className="text-zinc-600">{t.text}</p>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary hidden md:block border-4 border-white" />

                  <div
                    className={[
                      "md:w-[45%]",
                      left ? "" : "md:order-1",
                    ].join(" ")}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}