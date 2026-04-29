export default function AboutCTASection({
  headline = "Bereit für Versicherungsschutz, der wirklich zu Ihnen passt?",
  subheading = "Sprechen Sie mit unserem Team und erhalten Sie eine klare, persönliche Empfehlung.",
  buttonLabel = "Jetzt Beratung starten",
  buttonHref = "/contact",
}) {
  return (
    <section className="bg-background-light px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[3rem] bg-slate-950 p-10 text-center text-white shadow-soft-lg md:p-16">
        <h2 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          {headline}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
          {subheading}
        </p>

        <a
          href={buttonHref}
          className="mt-9 inline-flex rounded-full bg-accent px-8 py-4 text-sm font-black text-slate-950 transition hover:bg-white"
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  );
}