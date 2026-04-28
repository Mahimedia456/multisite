const faqs = [
  "How do I choose the right insurance plan?",
  "What types of insurance plans do you offer?",
  "Can I make changes to my policy after purchase?",
  "Do you provide insurance for small businesses?",
  "How long does it take to process a claim?",
];

export default function FAQSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Common questions about our coverage and services
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We have answered the most common questions to make insurance decisions easier.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((q, i) => (
            <details key={q} className="group rounded-2xl border border-slate-200 bg-background-light p-5">
              <summary className="cursor-pointer list-none font-black">
                Q{i + 1}. {q}
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Our advisors help explain coverage, compare options, and guide you through the process.
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}