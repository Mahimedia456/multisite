function Module({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl">
      <span className="material-symbols-outlined text-4xl text-primary mb-4">
        {icon}
      </span>
      <h4 className="font-bold text-lg">{title}</h4>
      <p className="text-sm text-slate-500 mt-2 text-center">{desc}</p>
    </div>
  );
}

export default function Zusatzbausteine({
  title = "Individuelle Zusatzbausteine",
  subtitle = "Passen Sie Ihren Schutz flexibel an Ihre Bedürfnisse an.",
  items = [
    {
      icon: "support_agent",
      title: "Premium Schutzbrief",
      desc: "Pannenhilfe vor Ort, auch bei leerem Akku (Abschleppen zur nächsten Ladestation).",
    },
    {
      icon: "analytics",
      title: "BonusDrive",
      desc: "Sicher fahren und bis zu 30% Ihrer Prämie als Cashback zurückerhalten.",
    },
    {
      icon: "verified_user",
      title: "WerkstattBonus",
      desc: "Rabatt auf die Kasko-Prämie durch Nutzung unserer zertifizierten E-Fachwerkstätten.",
    },
  ],
}) {
  return (
    <section className="mb-24 text-center">
      <h2 className="text-3xl font-black text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 max-w-2xl mx-auto mb-12">{subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <Module key={i} {...it} />
        ))}
      </div>
    </section>
  );
}
