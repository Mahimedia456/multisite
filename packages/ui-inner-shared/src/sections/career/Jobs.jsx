// packages/ui-inner-shared/src/sections/career/Jobs.jsx
export default function Jobs({ id = "jobs", title = "Offene Positionen", rows = [] }) {
  return (
    <section id={id} className="py-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">work</span>
        <h2 className="text-xl md:text-2xl font-black">{title}</h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          <div>Position</div>
          <div>Standort</div>
          <div className="text-right">Aktion</div>
        </div>

        <div className="divide-y">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-3 px-6 py-4 items-center">
              <div className="font-medium">{r?.position || ""}</div>
              <div className="text-gray-500">{r?.location || ""}</div>
              <div className="text-right">
                <a href={r?.href || "#"} className="text-primary font-semibold hover:underline">
                  {r?.actionLabel || "Jetzt bewerben"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
