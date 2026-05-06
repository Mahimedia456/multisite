import MIcon from "../../MIcon";

const DEFAULT_ITEMS = [
  { icon: "call", title: "Telefon", value: "+49 000 000 000" },
  { icon: "mail", title: "E-Mail", value: "kontakt@tierisch-gut.de" },
  { icon: "schedule", title: "Öffnungszeiten", value: "Mo - Fr: 09:00 - 18:00 Uhr" },
  { icon: "location_on", title: "Adresse", value: "Offheimer Weg 36, 65549 Limburg" },
];

export default function ContactInfo({ items = DEFAULT_ITEMS }) {
  const list = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;

  return (
    <section className="bg-white py-16 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          {list.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-zinc-50 border border-zinc-100 p-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <MIcon name={item.icon} className="text-primary text-[24px]" />
              </div>

              <h3 className="font-extrabold text-zinc-900">{item.title}</h3>

              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}