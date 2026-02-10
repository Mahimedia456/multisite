export default function AgencyCTA({
  title = "Persönliche Beratung vor Ort",
  subtitle = "Allianz Generalagentur Stemmer – Wir sind für Sie da.",
  phone = "05231 91010",
  cta = "Termin vereinbaren"
}) {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-black mb-2">{title}</h2>
          <p className="font-medium opacity-90">{subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
            <span className="material-symbols-outlined">call</span>
            <span className="text-xl font-bold">{phone}</span>
          </div>

          <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-all">
            {cta}
          </button>
        </div>
      </div>
    </section>
  );
}
