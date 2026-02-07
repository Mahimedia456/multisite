import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";

const plans = [
  { name: "Basis", price: "ab 1,60 %", desc: "Kurzfristig und sicher parken: Allianz ParkDepot (Beispiel).", highlight: false },
  { name: "Empfehlung", price: "Premium", desc: "Sofortleistung ohne Wartezeit – bis zu 100 % Kostenerstattung (Beispiel).", highlight: true },
  { name: "Individuell", price: "Beratung", desc: "Passende Lösungen für Ihre Situation – persönlich oder digital.", highlight: false },
];

export default function Pricing() {
  return (
    <section className="py-16 bg-[#070A0D] text-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Reveal>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-white/60">
              Angebote im Überblick
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Empfehlungen & Highlights</h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-3 text-sm text-white/70 max-w-2xl mx-auto">
              Transparent, verständlich und passend zu Ihrem Bedarf (Demo-Inhalte).
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6" from={120} step={90}>
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-[2.2rem] border p-7 shadow-sm",
                p.highlight ? "bg-[#f5c400] text-black border-[#f5c400]" : "bg-white/5 text-white border-white/10",
              ].join(" ")}
            >
              <div className="text-sm font-extrabold">{p.name}</div>
              <div className="mt-3 text-3xl font-extrabold">{p.price}</div>
              <div className={["mt-2 text-sm", p.highlight ? "text-black/70" : "text-white/70"].join(" ")}>
                {p.desc}
              </div>

              <ul className={["mt-6 space-y-3 text-sm", p.highlight ? "text-black/80" : "text-white/80"].join(" ")}>
                <li>• Online abschließen</li>
                <li>• Leistungen vergleichen</li>
                <li>• Persönliche Beratung</li>
                <li>• Schnelle Hilfe im Schadenfall</li>
              </ul>

              <button
                className={[
                  "mt-7 h-11 w-full rounded-xl font-extrabold text-sm hover:opacity-90",
                  p.highlight ? "bg-black text-white" : "bg-[#f5c400] text-black",
                ].join(" ")}
              >
                Mehr erfahren
              </button>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
