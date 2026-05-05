export default function ContactHeroSection({
  eyebrow = "Kontakt",
  headline = "Fragen? Wir beraten Sie persönlich",
  subheading = "Unser Team hilft Ihnen, den passenden Versicherungsschutz zu finden.",
  primaryLabel = "Ansprechpartner finden",
  primaryHref = "/beratung",
  secondaryLabel = "Online-Services",
  secondaryHref = "/services",
}) {
  return (
    <section className="relative bg-[#003781] py-24 text-white overflow-hidden">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>

        <h1 className="mx-auto max-w-3xl text-5xl font-black leading-tight md:text-6xl">
          {headline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75">
          {subheading}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={primaryHref}
            className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-black hover:opacity-90"
          >
            {primaryLabel}
          </a>

          <a
            href={secondaryHref}
            className="inline-flex rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-extrabold text-white hover:bg-white/15"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}