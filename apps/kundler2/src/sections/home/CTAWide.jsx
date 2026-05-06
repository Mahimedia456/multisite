import Reveal from "../../components/Reveal";
import { HOME_IMAGES } from "../../data/homeImages";

function img(key, fallback) {
  return HOME_IMAGES[key] || HOME_IMAGES[fallback] || "";
}

export default function CTAWide({
  eyebrow,
  headline,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  imageKey = "ctaBg",
}) {
  return (
    <section className="relative py-16 bg-background-dark">
      <div className="absolute inset-0">
        <img src={img(imageKey, "ctaBg")} alt="" className="w-full h-full object-cover opacity-45" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-white">
        <Reveal>
          <div className="text-[10px] uppercase text-white/60">{eyebrow}</div>
          <div className="text-3xl font-extrabold mt-2">{headline}</div>
          <p className="mt-2 text-white/70">{body}</p>

          <div className="mt-6 flex gap-3">
            <a href={primaryHref} className="bg-primary text-text-dark px-6 py-3 rounded-xl font-extrabold">
              {primaryLabel}
            </a>

            <a href={secondaryHref} className="border border-white/20 px-6 py-3 rounded-xl">
              {secondaryLabel}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}