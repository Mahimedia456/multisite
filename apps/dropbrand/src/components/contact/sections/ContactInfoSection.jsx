export default function ContactInfoSection({
  eyebrow = "Kontaktinformationen",
  headline = "Sprechen Sie direkt mit unserem Team",
  phone = "+49 000 000 000",
  email = "kontakt@dropbrand.de",
  address = "Musterstraße 12, 60311 Frankfurt am Main",
  hours = "Mo - Fr: 09:00 - 18:00 Uhr",
}) {
  const cards = [
    {
      title: "Telefon",
      value: phone,
    },
    {
      title: "E-Mail",
      value: email,
    },
    {
      title: "Adresse",
      value: address,
    },
    {
      title: "Öffnungszeiten",
      value: hours,
    },
  ];

  return (
    <section className="bg-background-light py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            {headline}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] bg-white p-7 shadow-soft"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                ✓
              </div>

              <h3 className="mb-2 text-lg font-black text-slate-950">
                {card.title}
              </h3>

              <p className="text-sm leading-7 text-slate-600">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}