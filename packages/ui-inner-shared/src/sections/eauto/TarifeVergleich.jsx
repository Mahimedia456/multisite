export default function TarifeVergleich({
  title = "Unsere Tarife im Vergleich",
  columns = ["Direct", "Direct Plus", "Komfort", "Premium"],
  rows = [
    {
      icon: "battery_charging_full",
      label: "Akku-Schutz",
      values: ["Standard", "Erweitert", "All-Risk", "All-Risk Plus"],
      premiumHighlight: true,
      komfortBold: true,
    },
    {
      icon: "cable",
      label: "Ladekabel & Zubehör",
      values: ["—", "bis 1.000€", "bis 2.500€", "Unbegrenzt"],
      premiumHighlight: true,
      komfortBold: true,
    },
    {
      icon: "ev_station",
      label: "Wallbox Schutz",
      values: ["—", "—", "Inklusive", "Inklusive"],
      premiumHighlight: true,
      komfortBold: true,
    },
    {
      icon: "car_repair",
      label: "Ersatzwagen (E)",
      values: ["Optional", "Optional", "Inklusive", "Inklusive"],
      premiumHighlight: true,
      komfortBold: true,
    },
  ],
}) {
  return (
    <section className="mb-24 overflow-x-auto">
      <h2 className="text-3xl font-black text-slate-900 mb-8">{title}</h2>

      <div className="min-w-[800px] border border-slate-200 rounded-xl overflow-hidden bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider w-1/4">
                Leistungen
              </th>
              <th className="p-6 text-center text-lg font-black text-slate-900">
                {columns[0]}
              </th>
              <th className="p-6 text-center text-lg font-black text-slate-900">
                {columns[1]}
              </th>
              <th className="p-6 text-center text-lg font-black text-slate-900">
                {columns[2]}
              </th>
              <th className="p-6 text-center text-lg font-black text-primary bg-primary/5 border-x border-primary/20">
                {columns[3]}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="p-6 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    {r.icon}
                  </span>
                  {r.label}
                </td>

                {r.values.map((v, ci) => {
                  const isPremium = ci === 3;
                  const isKomfort = ci === 2;
                  const cellBase =
                    "p-6 text-center " +
                    (v === "—" ? "text-slate-400" : "text-slate-600");
                  const komfort =
                    isKomfort && r.komfortBold
                      ? " font-bold text-slate-900"
                      : "";
                  const premium =
                    isPremium && r.premiumHighlight
                      ? " font-black text-primary bg-primary/5 border-x border-primary/20"
                      : "";

                  return (
                    <td key={ci} className={cellBase + komfort + premium}>
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
