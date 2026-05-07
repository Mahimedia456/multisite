import MIcon from "../../MIcon";

export default function ContactHero({
  eyebrow = "Kontakt",
  title = "Wir helfen Ihnen, den passenden Schutz für Ihr Tier zu finden.",
  description = "Ob Beratung, Tarifvergleich oder Fragen zur Absicherung – unser Team ist gerne für Sie da.",
  primaryLabel = "Nachricht senden",
  primaryHref = "#kontaktformular",
  secondaryLabel = "Direkt anrufen",
  secondaryHref = "tel:+490000000000",
  imageUrl = "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1400&q=80",
}) {
  return (
    <section className="relative overflow-hidden bg-[rgb(var(--background))] py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white/70 to-primary/5" />
      <div className="absolute -right-28 top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-28 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {eyebrow}
          </span>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
            {description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              {primaryLabel}
              <MIcon name="arrow_downward" className="ml-2 text-[20px]" />
            </a>

            <a
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-white px-8 py-4 text-sm font-black text-primary transition hover:bg-primary hover:text-white"
            >
              <MIcon name="call" className="mr-2 text-[20px]" />
              {secondaryLabel}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 -top-5 h-24 w-24 rounded-[2rem] bg-primary/20" />
          <div className="absolute -bottom-5 -right-5 h-32 w-32 rounded-[2rem] bg-primary/10" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-3 shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
            <img
              src={imageUrl}
              alt="Tier Beratung"
              className="h-[460px] w-full rounded-[2rem] object-cover"
            />

            <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] border border-white/20 bg-white/90 p-5 shadow-lg backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <MIcon name="pets" className="text-[26px]" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-950">
                    Persönliche Tierberatung
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Schnell, verständlich und unverbindlich
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}