import MIcon from "../../MIcon";

const ACTIONS = [
  { icon: "directions_car", title: "Kfz-Versicherung", desc: "Optimaler Schutz fürs Auto" },
  { icon: "medical_services", title: "Zahnzusatz", desc: "Premium-Schutz ohne Wartezeit" },
  { icon: "shield", title: "Schaden melden", desc: "24/7 digital oder telefonisch" },
];

export default function KundlerQuickActions() {
  return (
    <section className="py-10 bg-white border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Unser Highlight</h2>
            <p className="text-zinc-600">
              Schnelle & unkomplizierte Schadensabwicklung (Demo).
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Aktiv • Deutschlandweit
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {ACTIONS.map((a) => (
            <div
              key={a.title}
              className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 hover:bg-white transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MIcon name={a.icon} className="text-primary text-[22px]" />
                </span>
                <div>
                  <div className="font-extrabold text-zinc-900">{a.title}</div>
                  <div className="text-sm text-zinc-600">{a.desc}</div>
                </div>
              </div>

              <button className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900">
                Mehr entdecken <MIcon name="arrow_forward" className="text-[18px]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
