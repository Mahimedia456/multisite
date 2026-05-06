import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";
import { HOME_IMAGES } from "../../data/homeImages";

const defaultServices = [
  { n: "01", title: "Auto, Haus & Recht", desc: "Schützen Sie, was Ihnen wichtig ist – verlässlich und flexibel.", imageKey: "service1", href: "/auto-haus-recht", cta: "Mehr erfahren" },
  { n: "02", title: "Gesundheit & Freizeit", desc: "Leistungen, die im Alltag entlasten – von Zahn bis Reise.", imageKey: "service2", href: "/gesundheit-freizeit", cta: "Mehr erfahren" },
  { n: "03", title: "Tier", desc: "Für Hund & Katze: Schutz, der mit Ihrem Alltag mitgeht.", imageKey: "service3", href: "/tier", cta: "Mehr erfahren" },
  { n: "04", title: "Vorsorge & Vermögen", desc: "Vorsorgen, anlegen, absichern – passend zu Ihrem Lebensplan.", imageKey: "service4", href: "/vorsorge-vermoegen", cta: "Mehr erfahren" },
];

function imageFromKey(imageKey, fallbackKey) {
  return HOME_IMAGES[imageKey] || HOME_IMAGES[fallbackKey] || "";
}

export default function Services({
  eyebrow = "Produkte & Bereiche",
  headline = "Passende Lösungen für Ihren Bedarf",
  subheading = "Entdecken Sie ausgewählte Versicherungen und Vorsorge-Angebote – übersichtlich und schnell.",
  buttonLabel = "Gesamtes Angebot",
  buttonHref = "/produkte",
  services = defaultServices,
}) {
  return (
    <section id="services" className="py-14 bg-surface-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <Reveal>
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-text-dark/50">
                {eyebrow}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-text-dark">
                {headline}
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-2 text-sm text-text-dark/60 max-w-2xl">
                {subheading}
              </p>
            </Reveal>
          </div>

          <Reveal delay={160} className="hidden sm:block">
            <a
              href={buttonHref}
              className="inline-flex h-10 px-5 rounded-xl bg-primary text-text-dark font-extrabold text-xs items-center justify-center hover:opacity-90 transition"
            >
              {buttonLabel}
            </a>
          </Reveal>
        </div>

        <Stagger className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" from={120} step={90}>
          {(services || []).map((s) => {
            const img = s.img || imageFromKey(s.imageKey, "service1");

            return (
              <div
                key={`${s.n}-${s.title}`}
                className="rounded-2xl border border-text-dark/10 bg-surface-light shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="h-36 bg-background-light">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-background-dark text-white text-[10px] font-extrabold flex items-center justify-center">
                      {s.n}
                    </div>

                    <h3 className="font-extrabold text-text-dark">{s.title}</h3>
                  </div>

                  <p className="mt-2 text-sm text-text-dark/60">{s.desc}</p>

                  <a
                    href={s.href}
                    className="mt-4 inline-flex h-9 px-4 rounded-xl bg-primary text-text-dark text-[11px] font-extrabold items-center justify-center hover:opacity-90 transition"
                  >
                    {s.cta}
                  </a>
                </div>
              </div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}