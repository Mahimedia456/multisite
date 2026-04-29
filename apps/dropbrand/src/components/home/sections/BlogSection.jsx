const defaultPosts = [
  {
    title: "So wählen Sie den richtigen Versicherungsschutz",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=900",
  },
  {
    title: "5 häufige Fehler bei Versicherungen vermeiden",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=900",
  },
  {
    title: "Krankenversicherung einfach erklärt",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=900",
  },
];

export default function BlogSection({
  eyebrow = "Aktuelle Beiträge",
  headline = "Neuigkeiten, Ratgeber und Updates",
  posts = defaultPosts,
}) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">{headline}</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <article
              key={`${p.title}-${i}`}
              className="overflow-hidden rounded-[2rem] bg-background-light shadow-sm"
            >
              <img
                src={p.image}
                alt=""
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-lg font-black leading-snug">{p.title}</h3>
                <button className="mt-5 text-sm font-black text-primary">
                  Mehr lesen →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}