import MIcon from "../../MIcon";

const DEFAULT_ITEMS = [
  {
    q: "Wie schnell bekomme ich eine Antwort?",
    a: "In der Regel melden wir uns innerhalb eines Werktages zurück.",
  },
  {
    q: "Ist die Beratung kostenlos?",
    a: "Ja, die Beratung ist kostenlos und unverbindlich.",
  },
  {
    q: "Kann ich verschiedene Tarife vergleichen lassen?",
    a: "Ja, wir prüfen passende Optionen und erklären die Unterschiede verständlich.",
  },
];

export default function ContactFAQ({
  title = "Häufige Fragen zum Kontakt",
  subtitle = "Die wichtigsten Antworten rund um Beratung, Kontakt und Tarifvergleich.",
  items = DEFAULT_ITEMS,
}) {
  const faqItems = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;

  return (
    <section className="bg-[rgb(var(--background))] py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
            FAQ
          </p>

          <h2 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            {title}
          </h2>

          <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-slate-600">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={`${item.q}-${index}`}
              className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition open:border-primary open:shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="text-base font-black leading-snug text-slate-950">
                    {item.q}
                  </h3>
                </div>

                <MIcon
                  name="expand_more"
                  className="text-primary transition group-open:rotate-180"
                />
              </summary>

              <p className="mt-5 border-t border-slate-100 pt-5 text-sm font-semibold leading-7 text-slate-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}