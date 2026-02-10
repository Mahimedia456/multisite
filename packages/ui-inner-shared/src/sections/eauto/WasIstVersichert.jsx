function List({ tone = "ok", title, items }) {
  const isOk = tone === "ok";
  return (
    <div>
      <h3
        className={[
          "text-xl font-bold flex items-center gap-2 mb-6",
          isOk ? "text-primary" : "text-red-500",
        ].join(" ")}
      >
        <span className="material-symbols-outlined">
          {isOk ? "check_circle" : "cancel"}
        </span>
        {title}
      </h3>

      <ul className="space-y-4">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 text-slate-700">
            <span
              className={[
                "material-symbols-outlined",
                isOk ? "text-primary" : "text-red-500",
              ].join(" ")}
            >
              {isOk ? "done" : "close"}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WasIstVersichert({
  title = "Was ist versichert?",
  coveredTitle = "Abgedeckt",
  notCoveredTitle = "Nicht abgedeckt",
  covered = [
    "Überspannungsschäden durch Blitzeinschlag beim Laden",
    "Akku-Defekte durch Tierbiss (Marder)",
    "Grobe Fahrlässigkeit (z.B. bei Rot über die Ampel)",
    "Entsorgungskosten für defekte Akkus",
  ],
  notCovered = [
    "Natürlicher Verschleiß und Alterung des Akkus",
    "Vorsätzliche Beschädigung des Fahrzeugs",
    "Schäden durch Rennen oder Wettbewerbe",
  ],
}) {
  return (
    <section className="mb-24 py-16 px-8 bg-primary/5 rounded-3xl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <List tone="ok" title={coveredTitle} items={covered} />
          <List tone="bad" title={notCoveredTitle} items={notCovered} />
        </div>
      </div>
    </section>
  );
}
