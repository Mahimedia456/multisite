function OfferCard({ icon, title, desc, linkText = "Mehr erfahren" }) {
  return (
    <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary transition-all shadow-sm">
      <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 mb-6">{desc}</p>
      <a className="text-primary font-bold inline-flex items-center gap-2" href="#">
        {linkText}
        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
          arrow_forward
        </span>
      </a>
    </div>
  );
}

export default function Offers({
  title = "Spezielle E-Mobility Angebote",
  items = [
    {
      icon: "currency_exchange",
      title: "THG-Quote",
      desc: "Verkaufen Sie Ihre CO2-Einsparungen und sichern Sie sich bis zu 300€ Prämie pro Jahr.",
    },
    {
      icon: "map",
      title: "Allianz E-Charge App",
      desc: "Zugang zu über 400.000 Ladepunkten europaweit zu exklusiven Allianz Konditionen.",
    },
  ],
}) {
  return (
    <section className="mb-24">
      <h2 className="text-3xl font-black text-slate-900 mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((it, i) => (
          <OfferCard key={i} {...it} />
        ))}
      </div>
    </section>
  );
}
