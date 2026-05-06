import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";

export default function FAQ({
  eyebrow,
  headline,
  subheading,
  buttonLabel,
  buttonHref,
  faqs = [],
}) {
  return (
    <section className="py-16 bg-background-light">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-xs font-extrabold text-text-dark/70">{eyebrow}</div>
            <h2 className="text-3xl font-extrabold mt-2 text-text-dark">{headline}</h2>
            <p className="text-sm mt-2 text-text-dark/60">{subheading}</p>
            <a href={buttonHref} className="mt-6 inline-block bg-primary text-text-dark px-6 py-3 rounded-xl font-extrabold">
              {buttonLabel}
            </a>
          </Reveal>
        </div>

        <Stagger className="lg:col-span-7 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="bg-surface-light p-5 rounded-xl border border-text-dark/10">
              <summary className="font-extrabold cursor-pointer text-text-dark">{f.q}</summary>
              <p className="mt-2 text-sm text-text-dark/60">{f.a}</p>
            </details>
          ))}
        </Stagger>
      </div>
    </section>
  );
}