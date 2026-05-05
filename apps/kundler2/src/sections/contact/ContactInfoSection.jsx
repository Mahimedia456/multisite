const DEFAULT_CARDS = [
  { title: "Telefon", value: "+49 000 000 000", icon: "call" },
  { title: "E-Mail", value: "kontakt@kundler3.de", icon: "mail" },
  { title: "Adresse", value: "Musterstraße 12, 60311 Frankfurt am Main", icon: "location_on" },
  { title: "Öffnungszeiten", value: "Mo - Fr: 09:00 - 18:00 Uhr", icon: "schedule" },
];

export default function ContactInfoSection({
  eyebrow = "Kontaktinformationen",
  headline = "Sprechen Sie direkt mit unserem Team",
  subheading = "Wählen Sie den passenden Kontaktweg. Wir unterstützen Sie schnell, persönlich und verständlich.",
  cards = DEFAULT_CARDS,
}) {
  return (
    <section className="bg-[#f6f7f8] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>

          <h2 className="text-4xl font-black leading-tight text-zinc-950 md:text-5xl">
            {headline}
          </h2>

          <p className="mt-4 text-zinc-600 leading-7">{subheading}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {(cards || []).map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] bg-white p-7 shadow-sm border border-black/5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">{card.icon || "check"}</span>
              </div>

              <h3 className="mb-2 text-lg font-black text-zinc-950">
                {card.title}
              </h3>

              <p className="text-sm leading-7 text-zinc-600">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}