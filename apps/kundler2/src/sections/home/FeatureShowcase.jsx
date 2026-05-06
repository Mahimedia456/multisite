import Reveal from "../../components/Reveal";
import { HOME_IMAGES } from "../../data/homeImages";

function imageFromKey(imageKey, fallbackKey) {
  return HOME_IMAGES[imageKey] || HOME_IMAGES[fallbackKey] || "";
}

export default function FeatureShowcase({
  eyebrow = "Empfehlungen",
  headline = "Empfehlungen für Sie – schnell finden, was zu Ihnen passt",
  body = "Von Kfz bis Rechtsschutz: entdecken Sie Highlights, Vorteile und passende Optionen – transparent und verständlich.",
  primaryLabel = "Produkte ansehen",
  primaryHref = "/produkte",
  secondaryLabel = "Beratung & Kontakt",
  secondaryHref = "/beratung",
  leftImage,
  rightImage,
  leftImageKey = "featureLeft",
  rightImageKey = "featureRight",
}) {
  const leftSrc = leftImage || imageFromKey(leftImageKey, "featureLeft");
  const rightSrc = rightImage || imageFromKey(rightImageKey, "featureRight");

  return (
    <section className="bg-background-light py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <Reveal className="lg:col-span-5" y={22}>
            <div className="rounded-3xl overflow-hidden bg-surface-light border border-text-dark/5 shadow-sm">
              <img src={leftSrc} alt="" className="w-full h-72 object-cover" />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={80}>
            <div className="rounded-3xl bg-surface-light border border-text-dark/5 shadow-sm p-8 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-text-dark/60">
                  {eyebrow}
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight text-text-dark">
                  {headline}
                </h2>

                <p className="mt-3 text-sm text-text-dark/60 max-w-2xl">{body}</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={primaryHref}
                  className="h-10 px-5 rounded-xl bg-background-dark text-white font-extrabold text-sm hover:opacity-90 inline-flex items-center justify-center"
                >
                  {primaryLabel}
                </a>

                <a
                  href={secondaryHref}
                  className="h-10 px-5 rounded-xl bg-primary text-text-dark font-extrabold text-sm hover:opacity-90 inline-flex items-center justify-center"
                >
                  {secondaryLabel}
                </a>
              </div>

              <div className="mt-7 rounded-2xl overflow-hidden border border-text-dark/5">
                <img src={rightSrc} alt="" className="w-full h-40 object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}