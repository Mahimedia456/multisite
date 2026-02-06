const features = [
  { title: "Flexibel", text: "Beratung telefonisch, digital oder persönlich." },
  { title: "Exklusiv", text: "Individuelle Lösungen für jeden Kunden." },
  { title: "Schnell", text: "Unkomplizierte und schnelle Abwicklung." },
  { title: "Zuverlässig", text: "Über 20 Jahre Erfahrung & Vertrauen." },
];

export default function Features() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 px-5 text-center">
        {features.map((f, i) => (
          <div key={i}>
            <h4 className="text-xl font-semibold">{f.title}</h4>
            <p className="mt-3 text-neutral-600">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
