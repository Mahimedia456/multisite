import MIcon from "../../MIcon";

export default function ContactHero({
  eyebrow = "Kontakt",
  title = "Wir helfen Ihnen, den passenden Schutz für Ihr Tier zu finden.",
  description = "Ob Beratung, Tarifvergleich oder Fragen zur Absicherung – unser Team ist gerne für Sie da.",
  primaryLabel = "Nachricht senden",
  primaryHref = "#kontaktformular",
  secondaryLabel = "Direkt anrufen",
  secondaryHref = "tel:+490000000000",
}) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-primary/10 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/80 border border-zinc-200 text-primary font-bold text-xs uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-primary" />
          {eyebrow}
        </span>

        <h1 className="mx-auto max-w-3xl text-4xl lg:text-6xl font-extrabold leading-tight text-zinc-900">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
          {description}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={primaryHref}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold transition-all inline-flex items-center justify-center shadow-primary/20"
          >
            {primaryLabel}
            <MIcon name="arrow_downward" className="ml-2 text-[20px]" />
          </a>

          <a
            href={secondaryHref}
            className="px-8 py-4 rounded-full font-bold border border-zinc-200 bg-white hover:bg-zinc-50 transition-all text-zinc-800 inline-flex items-center justify-center"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}