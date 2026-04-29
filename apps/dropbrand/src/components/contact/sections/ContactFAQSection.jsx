export default function ContactFAQSection({
  eyebrow = "FAQ",
  headline = "Häufige Fragen vor dem Kontakt",
  items = [
    {
      q: "Wie schnell meldet sich das Team?",
      a: "In der Regel melden wir uns innerhalb eines Werktages zurück.",
    },
    {
      q: "Kann ich eine persönliche Beratung buchen?",
      a: "Ja, unser Team bietet persönliche Beratung passend zu Ihrem Bedarf.",
    },
    {
      q: "Kostet die erste Anfrage etwas?",
      a: "Nein, die erste Anfrage ist unverbindlich und kostenlos.",
    },
  ],
}) {
  return (
    <section className="bg-background-light py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            {headline}
          </h2>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-base font-black text-slate-950">
                {String(index + 1).padStart(2, "0")}. {item.q}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}