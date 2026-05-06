import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";
import { HOME_IMAGES } from "../../data/homeImages";

function img(key, fallback) {
  return HOME_IMAGES[key] || HOME_IMAGES[fallback] || "";
}

const defaultBullets = [
  {
    title: "Persönliche Beratung",
    body: "Ansprechpartner:innen vor Ort – einfach finden & kontaktieren.",
  },
  {
    title: "Digitale Services",
    body: "Online-Services, Hotlines und schnelle Hilfe im Schadenfall.",
  },
  {
    title: "Transparente Leistungen",
    body: "Klare Vorteile, verständliche Optionen und passende Empfehlungen.",
  },
];

export default function AboutSplit({
  eyebrow = "Wir sind für Sie da",
  headline = "Beratung, Schutz und Vorsorge – passend zu Ihrem Leben",
  body = "Wir empfehlen Ihnen, Ihre persönliche Situation und Ihren Bedarf gemeinsam mit Fachleuten zu besprechen – gerne unterstützen wir Sie.",
  image,
  imageKey = "aboutRight",
  buttonLabel = "Mehr über uns",
  buttonHref = "/about",
  bullets = defaultBullets,
}) {
  const imageSrc = image || img(imageKey, "aboutRight");

  return (
    <section className="py-16 bg-background-light" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-text-dark/60">
                {eyebrow}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight text-text-dark">
                {headline}
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-3 text-sm text-text-dark/60 max-w-xl">
                {body}
              </p>
            </Reveal>

            <Stagger
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
              from={180}
              step={90}
            >
              {(bullets || []).map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl bg-surface-light border border-text-dark/5 p-6 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary text-text-dark flex items-center justify-center font-extrabold">
                    ✓
                  </div>

                  <div className="mt-4 font-extrabold text-text-dark">
                    {b.title}
                  </div>

                  <div className="mt-1 text-sm text-text-dark/60">
                    {b.body}
                  </div>
                </div>
              ))}
            </Stagger>

            <Reveal delay={520}>
              <a
                href={buttonHref}
                className="mt-8 inline-flex h-11 px-6 rounded-xl bg-primary text-text-dark font-extrabold text-sm items-center justify-center hover:opacity-90"
              >
                {buttonLabel}
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={120} y={22}>
              <div className="rounded-[2.2rem] overflow-hidden border border-text-dark/5 shadow-sm bg-surface-light">
                <img
                  src={imageSrc}
                  alt=""
                  className="w-full h-[420px] object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}