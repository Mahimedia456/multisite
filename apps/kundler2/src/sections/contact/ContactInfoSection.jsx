const DEFAULT_CARDS = [
  { title: "Telefon", value: "+49 000 000 000", icon: "call" },
  { title: "E-Mail", value: "kontakt@kundler3.de", icon: "mail" },
  {
    title: "Adresse",
    value: "Musterstraße 12, 60311 Frankfurt am Main",
    icon: "location_on",
  },
  { title: "Öffnungszeiten", value: "Mo - Fr: 09:00 - 18:00 Uhr", icon: "schedule" },
];

export default function ContactInfoSection({
  eyebrow = "Kontaktinformationen",
  headline = "Sprechen Sie direkt mit unserem Team",
  subheading = "Wählen Sie den passenden Kontaktweg. Wir unterstützen Sie schnell, persönlich und verständlich.",
  cards = DEFAULT_CARDS,
}) {
  return (
    <section className="bg-[#f5f8f8] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 max-w-3xl">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {(cards || []).map((card) => (
            <div
              key={card.title}
              className="group rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-soft"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  {card.icon || "check"}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-black text-slate-950">
                {card.title}
              </h3>

              <p className="text-sm font-semibold leading-7 text-slate-600">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}