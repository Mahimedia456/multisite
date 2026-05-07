const DEFAULT_ITEMS = [
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
];

export default function ContactFAQSection({
  eyebrow = "FAQ",
  headline = "Häufige Fragen vor dem Kontakt",
  subheading = "Hier finden Sie schnelle Antworten, bevor Sie unser Team kontaktieren.",
  items = DEFAULT_ITEMS,
}) {
  return (
    <section className="bg-[#f5f8f8] py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
            {headline}
          </h2>

          <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
            {subheading}
          </p>
        </div>

        <div className="space-y-4">
          {(items || []).map((item, index) => (
            <div
              key={`${item.q}-${index}`}
              className="group rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-soft"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="text-lg font-black leading-snug text-slate-950">
                {item.q}
              </h3>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}