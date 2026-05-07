import MIcon from "../../MIcon";

const DEFAULT_ITEMS = [
  { icon: "call", title: "Telefon", value: "+49 000 000 000" },
  { icon: "mail", title: "E-Mail", value: "kontakt@tierisch-gut.de" },
  { icon: "schedule", title: "Öffnungszeiten", value: "Mo - Fr: 09:00 - 18:00 Uhr" },
  { icon: "location_on", title: "Adresse", value: "Offheimer Weg 36, 65549 Limburg" },
];

export default function ContactInfo({
  eyebrow = "Kontaktwege",
  title = "So erreichen Sie uns",
  description = "Wählen Sie den Kontaktweg, der für Sie am besten passt.",
  items = DEFAULT_ITEMS,
}) {
  const list = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
            <h2 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {title}
            </h2>
          </div>

          <p className="max-w-xl text-sm font-semibold leading-7 text-slate-600">
            {description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {list.map((item) => (
            <div
              key={item.title}
              className="group rounded-[2rem] border border-slate-200 bg-[rgb(var(--background))] p-7 transition hover:-translate-y-1 hover:border-primary hover:bg-white hover:shadow-soft"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                <MIcon name={item.icon} className="text-[26px]" />
              </div>

              <h3 className="text-xl font-black text-slate-950">{item.title}</h3>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}