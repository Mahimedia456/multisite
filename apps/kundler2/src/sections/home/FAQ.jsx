const faqs = [
  { q: "Do you handle design and construction together?", a: "Yes. We offer full design-build delivery with one team and one timeline." },
  { q: "How do you estimate budgets?", a: "We start with a scope workshop, then provide a phased estimate with materials and labor." },
  { q: "Do you work internationally?", a: "We can support international coordination depending on project scope and regulations." },
  { q: "How long does a typical project take?", a: "Timelines depend on scope; we provide milestones and weekly progress updates." },
];

export default function FAQ() {
  return (
    <section className="py-16 bg-[#f6f7f8]" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
              FAQ
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">
              We’re here to provide clear and helpful answers
            </h2>
            <p className="mt-3 text-sm text-black/60">
              If you have a different question, contact us and we’ll reply quickly.
            </p>

            <button className="mt-6 h-11 px-6 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
              Contact Support
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-3xl bg-white border border-black/5 p-6 shadow-sm"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <div className="font-extrabold">{f.q}</div>
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-extrabold group-open:bg-[#f5c400] group-open:text-black">
                    +
                  </div>
                </summary>
                <div className="mt-4 text-sm text-black/60 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
