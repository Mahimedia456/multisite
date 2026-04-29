export default function TestimonialsSection({
  eyebrow = "Kundenstimmen",
  headline = "Vertrauen durch echte Erfahrungen",
  image = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200",
  rating = "★★★★★",
  quote = "Das Team hat meine Bedürfnisse verstanden und jede Option klar erklärt. Der gesamte Prozess war einfach und professionell.",
  name = "Robert Fox",
  role = "Unternehmer",
}) {
  return (
    <section className="bg-background-light py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <img
          src={image}
          alt=""
          className="h-[560px] w-full rounded-[2rem] object-cover shadow-soft-lg"
        />

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-black uppercase tracking-widest text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black">{headline}</h2>

          <div className="mt-8 text-accent">{rating}</div>

          <p className="mt-5 text-lg leading-8 text-slate-600">“{quote}”</p>

          <div className="mt-7">
            <p className="font-black">{name}</p>
            <p className="text-sm text-slate-500">{role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}