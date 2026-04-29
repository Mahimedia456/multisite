export default function AboutHeroSection({
  eyebrow = "Über DropBrand",
  headline = "Versicherung neu gedacht: persönlich, transparent und zuverlässig",
  subheading = "Wir helfen Menschen, Familien und Unternehmen dabei, die richtige Absicherung für ihre Zukunft zu finden.",
  image = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1400",
  badge = "Vertrauen. Schutz. Zukunft.",
}) {
  return (
    <section className="relative overflow-hidden bg-background-light px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-primary shadow-soft">
            {eyebrow}
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-7xl">
            {headline}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            {subheading}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="rounded-full bg-primary px-7 py-4 text-sm font-black text-white shadow-soft transition hover:bg-primary-dark"
            >
              Kontakt aufnehmen
            </a>

            <a
              href="/services"
              className="rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-900 shadow-sm transition hover:border-primary hover:text-primary"
            >
              Leistungen ansehen
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 -top-8 h-44 w-44 rounded-full bg-accent/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-soft-lg">
            <img
              src={image}
              alt={headline}
              className="h-[520px] w-full rounded-[2rem] object-cover"
            />

            <div className="absolute bottom-8 left-8 rounded-3xl bg-white/95 p-5 shadow-soft backdrop-blur">
              <div className="text-sm font-black text-primary">{badge}</div>
              <div className="mt-1 text-3xl font-black text-slate-950">15+</div>
              <div className="text-sm text-slate-500">Jahre Erfahrung</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}