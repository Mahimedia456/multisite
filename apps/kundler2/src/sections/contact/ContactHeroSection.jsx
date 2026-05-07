export default function ContactHeroSection({
  eyebrow = "Kontakt",
  headline = "Fragen? Wir beraten Sie persönlich",
  subheading = "Unser Team hilft Ihnen, den passenden Versicherungsschutz zu finden.",
  primaryLabel = "Ansprechpartner finden",
  primaryHref = "/beratung",
  secondaryLabel = "Online-Services",
  secondaryHref = "/services",
  backgroundImage = "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80",
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-28 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/85 to-primary/80" />
      <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-4xl">
          <p className="mb-5 inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
            {eyebrow}
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            {headline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/80">
            {subheading}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              {primaryLabel}
            </a>

            <a
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-slate-950"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}