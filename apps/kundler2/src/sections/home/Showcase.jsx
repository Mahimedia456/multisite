import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";
import { HOME_IMAGES } from "../../data/homeImages";

function img(key, fallback) {
  return HOME_IMAGES[key] || HOME_IMAGES[fallback] || "";
}

export default function Showcase({
  eyebrow = "Empfehlungen",
  headline = "Passende Versicherungen zu Ihrem Bedarf",
  buttonLabel = "Alles ansehen",
  buttonHref = "/produkte",
  cards = [],
}) {
  return (
    <section className="py-16 bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <Reveal>
              <div className="text-[10px] uppercase font-extrabold text-text-dark/60">
                {eyebrow}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-text-dark">
                {headline}
              </h2>
            </Reveal>
          </div>

          <a
            href={buttonHref}
            className="hidden sm:inline-flex h-10 px-5 rounded-xl bg-primary text-text-dark font-extrabold"
          >
            {buttonLabel}
          </a>
        </div>

        <Stagger className="mt-10 grid md:grid-cols-3 gap-6" from={120} step={90}>
          {(cards || []).map((c) => (
            <div key={c.title} className="rounded-2xl overflow-hidden border border-text-dark/10 shadow-sm bg-surface-light">
              <img src={img(c.imageKey, "project1")} alt="" className="h-64 w-full object-cover" />
              <div className="p-6">
                <div className="font-extrabold text-text-dark">{c.title}</div>
                <div className="text-sm text-text-dark/60 mt-1">{c.body}</div>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}