export default function AboutIntroSection({
  eyebrow = "Wer wir sind",
  headline = "Wir verbinden moderne Beratung mit verlässlichem Versicherungsschutz",
  body = "DropBrand steht für klare Kommunikation, faire Policen und persönliche Begleitung. Unser Ziel ist es, Versicherungen verständlich zu machen und Lösungen zu bieten, die wirklich zum Leben unserer Kunden passen.",
  quote = "Guter Versicherungsschutz beginnt mit ehrlicher Beratung und endet erst, wenn Menschen sich wirklich sicher fühlen.",
  image1 = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000",
  image2 = "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=900",
}) {
  return (
    <section className="bg-white px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid grid-cols-2 gap-5">
          <img
            src={image1}
            alt="Insurance consultation"
            className="h-[420px] rounded-[2rem] object-cover shadow-soft"
          />
          <img
            src={image2}
            alt="Business protection"
            className="mt-16 h-[420px] rounded-[2rem] object-cover shadow-soft"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </div>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            {headline}
          </h2>

          <p className="mt-7 text-lg leading-8 text-slate-600">{body}</p>

          <div className="mt-9 rounded-[2rem] bg-background-light p-7">
            <p className="text-xl font-bold leading-8 text-slate-900">
              “{quote}”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}