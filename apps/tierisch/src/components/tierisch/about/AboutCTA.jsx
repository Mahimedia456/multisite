export default function AboutCTA({
  title = "Sind Sie bereit, Ihr Tier bestmöglich zu schützen?",
  description = "Berechnen Sie in nur 2 Minuten Ihren individuellen Tarif – kostenlos und unverbindlich.",
  primaryLabel = "Jetzt Beitrag berechnen",
  primaryHref = "#",
  secondaryLabel = "Kontakt aufnehmen",
  secondaryHref = "/contact",
}) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-[2rem] p-12 text-center text-white relative overflow-hidden shadow-primary/20">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              {title}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                className="bg-white text-primary px-10 py-4 rounded-full font-extrabold hover:opacity-95 transition-colors shadow-xl"
                href={primaryHref}
              >
                {primaryLabel}
              </a>

              <a
                className="border-2 border-white text-white px-10 py-4 rounded-full font-extrabold hover:bg-white/10 transition-colors"
                href={secondaryHref}
              >
                {secondaryLabel}
              </a>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}