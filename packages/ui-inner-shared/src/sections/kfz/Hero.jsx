export default function Hero({
  title = "Passt nicht? Passt immer – die Allianz Kfz Versicherung",
  subtitle = "Kfz-Haftpflicht schon ab 99 Euro im Jahr. Individueller Schutz für jedes Fahrzeug und jeden Fahrer.",
  primaryCta = "Jetzt Tarif berechnen",
  secondaryCta = "Beratung finden",
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuC5x_Yc7pyI9EeiIuKgKu_xcR2_TOeidikRK_B0GsR6jwYagE-13L5ilIfaXMeKMkNHJ5vOFCFO2xm2uAidedKTHYzueTXFGRsgdjEftwEdrCJMQlsnE8RcFY1HHqND0jWnq6ZG98PKzSuAZAec_4FLttLbFtJKw26ryzvzpex-iEkC4xgcwvuhZzbZUjQPPi06AcnnWltAQ2YWRrYBievprH8p3U9xSV_to5szd5QGT935Sl9x5bT0hUdhODhqEkQzwQAj3atvCkE",
  badgeTitle = "Deutschlands Nr. 1",
  badgeBody = "Über 10 Millionen zufriedene Kunden vertrauen uns."
}) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl lg:text-6xl font-black text-[#0d1c1c] leading-[1.1] mb-6">
              {title}
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-lg">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                {primaryCta}
              </button>
              <button className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/5 transition-all">
                {secondaryCta}
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-[500px] object-cover"
                src={imageUrl}
                alt="Hero"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px]">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary font-bold">verified</span>
                <span className="font-bold">{badgeTitle}</span>
              </div>
              <p className="text-sm text-slate-500">{badgeBody}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
