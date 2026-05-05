import MIcon from "../../components/MIcon";

const DEFAULT_POINTS = [
  {
    title: "Persönliche Beratung",
    text: "Ansprechpartner:innen vor Ort – einfach finden & kontaktieren.",
  },
  {
    title: "Digitale Services",
    text: "Online-Services, Hotlines und schnelle Hilfe im Schadenfall.",
  },
  {
    title: "Transparente Leistungen",
    text: "Klare Vorteile, verständliche Optionen und passende Empfehlungen.",
  },
];

export default function KundlerSupport({
  headline = "Wir sind für Sie da",
  subheading = "Beratung, Schutz und Vorsorge – passend zu Ihrem Leben. Wir empfehlen, Ihre persönliche Situation gemeinsam mit Fachleuten zu besprechen.",
  points = DEFAULT_POINTS,
  primaryLabel = "Ansprechpartner:in finden",
  primaryHref = "/beratung",
  secondaryLabel = "Online-Services öffnen",
  secondaryHref = "/services",
  stripText = "Wir erklären in 60 Sekunden: So finden Sie die passende Absicherung",
  stripLabel = "Kurzvideo",
}) {
  return (
    <section id="support" className="py-16 bg-[rgb(var(--bg-light))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-zinc-200 bg-white overflow-hidden">
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
              {headline}
            </h2>

            <p className="mt-2 text-zinc-600 max-w-3xl">{subheading}</p>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {(points || []).map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="mt-0.5 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MIcon name="check" className="text-primary text-[18px]" />
                  </span>

                  <div>
                    <div className="font-extrabold text-zinc-900">
                      {p.title}
                    </div>
                    <div className="text-sm text-zinc-600">{p.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a
                href={primaryHref}
                className="inline-flex justify-center bg-primary hover:bg-primary-dark text-zinc-900 px-6 py-3 rounded-full font-extrabold transition shadow-primary/20"
              >
                {primaryLabel}
              </a>

              <a
                href={secondaryHref}
                className="inline-flex justify-center px-6 py-3 rounded-full font-extrabold border border-zinc-200 hover:bg-zinc-50 transition text-zinc-800"
              >
                {secondaryLabel}
              </a>
            </div>
          </div>

          <div className="px-8 sm:px-10 py-5 border-t border-zinc-100 bg-zinc-50 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-extrabold text-zinc-900">
              {stripText}
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900">
              <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <MIcon
                  name="play_arrow"
                  className="text-primary text-[20px]"
                />
              </span>
              {stripLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}