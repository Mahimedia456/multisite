export default function AboutSection({
  eyebrow = "Über uns",
  headline = "Wir schützen Leben, Werte und Zukunft mit Vertrauen",
  body = "Wir bieten zuverlässige Versicherungslösungen für Privatpersonen, Familien und Unternehmen – mit klarer Beratung, ehrlicher Absicherung und verlässlichem Service.",
  image1 = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=900",
  image2 = "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=900",
  statValue = "80+",
  statLabel = "Auszeichnungen",
  quote = "Versicherung bedeutet nicht nur Policen. Es geht darum, Menschen, Träume und Zukunft zu schützen.",
  buttonLabel = "Mehr über uns",
  buttonHref = "/about",
}) {
  return (
    <section className="bg-[#f8f4ed]">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div className="relative grid grid-cols-2 gap-4">
          <div
            className="h-[420px] rounded-[2rem] bg-cover bg-center shadow-xl"
            style={{ backgroundImage: `url(${image1})` }}
          />

          <div
            className="mt-16 h-[360px] rounded-[2rem] bg-cover bg-center shadow-xl"
            style={{ backgroundImage: `url(${image2})` }}
          />

          <div className="absolute bottom-8 left-1/2 rounded-3xl bg-white p-5 shadow-2xl">
            <div className="text-3xl font-black text-[#0f4a2c]">{statValue}</div>
            <p className="text-xs font-bold text-zinc-500">{statLabel}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-widest text-[#0f4a2c]">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            {headline}
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-600">{body}</p>

          <div className="mt-8 rounded-3xl border-l-4 border-[#ffb347] bg-white p-6 shadow-sm">
            <p className="text-lg font-bold text-zinc-800">“{quote}”</p>
          </div>

          <a
            href={buttonHref}
            className="mt-8 inline-flex rounded-full bg-[#ffb347] px-6 py-3 font-black text-[#07361f]"
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}