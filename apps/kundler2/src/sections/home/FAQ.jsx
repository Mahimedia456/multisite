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
    <section className="py-16 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-xs font-extrabold">{eyebrow}</div>
            <h2 className="text-3xl font-extrabold mt-2">{headline}</h2>
            <p className="text-sm mt-2 text-black/60">{subheading}</p>
            <a href={buttonHref} className="mt-6 inline-block bg-[#f5c400] px-6 py-3 rounded-xl font-extrabold">
              {buttonLabel}
            </a>
          </Reveal>
        </div>

        <Stagger className="lg:col-span-7 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="bg-white p-5 rounded-xl border">
              <summary className="font-extrabold cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-black/60">{f.a}</p>
            </details>
          ))}
        </Stagger>
      </div>
    </section>
  );
}